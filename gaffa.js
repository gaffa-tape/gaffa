//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

///[README.md]

"use strict";

var Gedi = require('gedi'),
    doc = require('doc-js'),
    crel = require('crel'),
    fastEach = require('fasteach'),
    createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    animationFrame = require('./raf.js'),
    laidout = require('laidout'),
    merge = require('merge'),
    statham = require('statham'),
    requestAnimationFrame = animationFrame.requestAnimationFrame,
    cancelAnimationFrame = animationFrame.cancelAnimationFrame;

// Storage for applications default styles.
var defaultViewStyles;

var removeViews = require('./removeViews'),
    jsonConverter = require('./jsonConverter');

var Property = require('./property'),
    ViewContainer = require('./viewContainer'),
    ViewItem = require('./viewItem'),
    View = require('./view'),
    ContainerView = require('./containerView'),
    Action = require('./action'),
    Behaviour = require('./behaviour');

function parseQueryString(url){
    var urlParts = url.split('?'),
        result = {};

    if(urlParts.length>1){

        var queryStringData = urlParts.pop().split("&");

        for(var i = 0; i < queryStringData.length; i++) {
            var parts = queryStringData[i].split("="),
                key = window.unescape(parts[0]),
                value = window.unescape(parts[1]);

            result[key] = value;
        }
    }

    return result;
}

function toQueryString(data){
    var queryString = '';

    for(var key in data){
        if(data.hasOwnProperty(key) && data[key] !== undefined){
            queryString += (queryString.length ? '&' : '?') + key + '=' + data[key];
        }
    }

    return queryString;
}

function clone(value){
    return statham.revive(value);
}

function tryParseJson(data){
    try{
        return JSON.parse(data);
    }catch(error){
        return error;
    }
}

function ajax(settings){
    var queryStringData,
        request = new XMLHttpRequest();
    if(typeof settings !== 'object'){
        settings = {};
    }

    if(settings.cors){
        //http://www.html5rocks.com/en/tutorials/cors/

        if ("withCredentials" in request) {

            // all good.

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            request = new XDomainRequest();
        } else {

            // Otherwise, CORS is not supported by the browser.
            throw "Cors is not supported by this browser";
        }
    }else{
        request = new XMLHttpRequest();
    }

    if(settings.cache === false){
        settings.data = settings.data || {};
        settings.data['_'] = new Date().getTime();
    }

    if(settings.type.toLowerCase() === 'get' && typeof settings.data === 'object'){
        queryStringData = parseQueryString(settings.url);
        for(var key in settings.data){
            if(settings.data.hasOwnProperty(key)){
                queryStringData[key] = settings.data[key];
            }
        }

        settings.url  = settings.url.split('?').shift() + toQueryString(queryStringData);
        settings.data = null;
    }

    request.addEventListener("progress", settings.progress, false);
    request.addEventListener("load", function(event){
        var data = event.target.responseText;

        if(settings.dataType === 'json'){
            if(data === ''){
                data = undefined;
            }else{
                data = tryParseJson(data);
            }
        }

        if(event.target.status >= 400){
            settings.error && settings.error(event, data instanceof Error ? undefined : data);
        }else{
            if(data instanceof Error){
                settings.error && settings.error(event, data);
            }else{
                settings.success && settings.success(data, event);
            }
        }

    }, false);
    request.addEventListener("error", settings.error, false);
    request.addEventListener("abort", settings.abort, false);
    request.addEventListener("loadend", settings.complete, false);

    request.open(settings.type || "get", settings.url, true);

    // Set default headers
    if(settings.contentType !== false){
        request.setRequestHeader('Content-Type', settings.contentType || 'application/json; charset=utf-8');
    }
    request.setRequestHeader('X-Requested-With', settings.requestedWith || 'XMLHttpRequest');
    request.setRequestHeader('x-gaffa', 'request');
    if(settings.auth){
        request.setRequestHeader('Authorization', settings.auth);
    }

    // Set custom headers
    for(var key in settings.headers){
        request.setRequestHeader(key, settings.headers[key]);
    }

    if(settings.processData !== false && settings.dataType === 'json'){
        settings.data = JSON.stringify(settings.data);
    }

    request.send(settings.data && settings.data);

    return request;
}

function getClosestItem(target){
    var viewModel = target.viewModel;

    while(!viewModel && target){
        target = target.parentNode;

        if(target){
            viewModel = target.viewModel;
        }
    }

    return viewModel;
}

function triggerAction(action, parent, scope, event) {
    Action.prototype.trigger.call(action, parent, scope, event);
    action.trigger(parent, scope, event);
}

function triggerActions(actions, parent, scope, event) {
    if(Array.isArray(actions)){
        for(var i = 0; i < actions.length; i++) {
            triggerAction(actions[i], parent, scope, event);
        }
    }
}

var addDefaultStyle = require('./addDefaultStyle');

var initialiseViewItem = require('./initialiseViewItem');
var initialiseView = require('./initialiseView');
var initialiseAction = require('./initialiseAction');
var initialiseBehaviour = require('./initialiseBehaviour');

function Gaffa(){
    var gedi,
        gaffa = Object.create(EventEmitter.prototype);

    // internal varaibles

        // Storage for the applications model.
    var internalModel = {},

        // Storage for the applications view.
        internalViewItems = [],

        // Storage for application actions.
        internalActions = {},

        // Storage for application behaviours.
        internalBehaviours = [],

        // Storage for interval based behaviours.
        internalIntervals = [];


    // Gedi initialisation
    gedi = new Gedi(internalModel);

    // Add gedi instance to gaffa.
    gaffa.gedi = gedi;

    function addBehaviour(behaviour) {
        //if the views isnt an array, make it one.
        if (Array.isArray(behaviour)) {
            for(var i = 0; i < behaviour.length; i++) {
                addBehaviour(behaviour[i]);
            }
            return;
        }

        behaviour.gaffa = gaffa;
        behaviour.parentContainer = internalBehaviours;

        Behaviour.prototype.bind.call(behaviour);
        behaviour.bind();

        internalBehaviours.push(behaviour);
    }


    function load(app, target){

        app = statham.revive(app);

        var targetView = gaffa.views;

        if(target){
            var targetParts = target.split('.'),
                targetName = targetParts[0],
                targetViewContainer = targetParts[1];

            targetView = gaffa.namedViews[targetName].views[targetViewContainer];
        }

        while(internalIntervals.length){
            clearInterval(internalIntervals.pop());
        }

        //clear state first
        if (app.views) {
            targetView.empty();
        }

        //set up state
        if (app.model) {
            gedi.set({});
            gaffa.model.set(app.model, null, null, false);
        }
        if (app.views) {
            for(var i = 0; i < app.views.length; i++) {
                app.views[i] = initialiseView(app.views[i], gaffa);
            }
            targetView.add(app.views);
        }
        if (app.behaviours) {
            for(var i = 0; i < app.behaviours.length; i++) {
                app.behaviours[i] = initialiseBehaviour(app.behaviours[i], gaffa);
            }
            gaffa.behaviours.add(app.behaviours);
        }

        gaffa.emit("load");
    }


    var pageCache = {};

    function navigate(url, target, pushState, data) {

        // Data will be passed to the route as a querystring
        // but will not be displayed visually in the address bar.
        // This is to help resolve caching issues.

        // default target
        if(target === undefined){
            target = gaffa.navigateTarget;
        }

        function success (data) {
            var title;

            data.target = target;

            if(data !== undefined && data !== null && data.title){
                title = data.title;
            }

            // Always use pushstate unless triggered by onpopstate
            if(pushState !== false) {
                gaffa.pushState(data, title, url);
            }

            pageCache[url] = data;

            gaffa.load(data, target);

            gaffa.emit("navigate.success");

            window.scrollTo(0,0);
        }

        function error(error){
            gaffa.emit("navigate.error", error);
        }

        function complete(){
            gaffa.emit("navigate.complete");
        }

        gaffa.emit("navigate");

        if(gaffa.cacheNavigates !== false && pageCache[url]){
            success(pageCache[url]);
            complete();
            return;
        }

        gaffa.ajax({
            url: gaffa.createNavigateUrl(url),
            type: "get",
            data: data,
            dataType: "json",
            success: success,
            error: error,
            complete: complete
        });
    }

    gaffa.createNavigateUrl = function(url){
        return url;
    };

    gaffa.onpopstate = function(event){
        if(event.state){
            navigate(window.location.toString(), event.state.target, false);
        }
    };

    // Overridable handler
    window.onpopstate = gaffa.onpopstate;

    function addDefaultsToScope(scope){
        scope.windowLocation = window.location.toString();
    }

    function resolvePath(viewItem){
        var parentPath = '[]';

        if(viewItem && viewItem.getPath){
            parentPath = viewItem.getPath();
        }

        var prefixMatch = parentPath.match(/^\[(\_scope\_.*?)\/.*$/);

        if(!prefixMatch){
            parentPath = gedi.paths.resolve(gedi.paths.create('$'), parentPath)
        }


        return parentPath;
    }

    function modelGet(path, viewItem, scope, asTokens) {
        if(!(viewItem instanceof ViewItem || viewItem instanceof Property)){
            scope = viewItem;
            viewItem = undefined;
        }

        scope = scope || {};

        addDefaultsToScope(scope);
        var parentPath = resolvePath(viewItem);

        return gedi.get(path, parentPath, scope, asTokens);
    }

    function modelSet(path, value, viewItem, dirty, scope){
        if(path == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        if(typeof path === 'object'){
            value = path;
            path = '[]';
        }

        gedi.set(path, value, parentPath, dirty, scope);
    }

    function modelRemove(path, viewItem, dirty) {
        var parentPath;

        if(path == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        gedi.remove(path, parentPath, dirty);
    }

    function modelBind(path, callback, viewItem, scope) {
        var parentPath = resolvePath(viewItem);

        if(!viewItem.gediCallbacks){
            viewItem.gediCallbacks = [];
        }

        // Add the callback to the list of handlers associated with the viewItem
        viewItem.gediCallbacks.push(function(){
            gedi.debind(path, callback, parentPath, scope);
        });

        gedi.bind(path, callback, parentPath, scope);
    }

    function modelDebind(viewItem) {
        while(viewItem.gediCallbacks && viewItem.gediCallbacks.length){
            viewItem.gediCallbacks.pop()();
        }
    }

    function modelIsDirty(path, viewItem) {
        if(path == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        return gedi.isDirty(path, parentPath);
    }

    function modelSetDirtyState(path, value, viewItem) {
        if(path == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        gedi.setDirtyState(path, value, parentPath);
    }


/**
    ## The gaffa instance

    Instance of Gaffa

        var gaffa = new Gaffa();
*/

    var gaffaPublicObject = {

        /**
            ### .addDefaultStyle

            used to add default syling for a view to the application, eg:

                MyView.prototype.render = function(){
                    //render code...

                    gaffa.addDefaultStyle(css);

                };

            Gaffa encourages style-free Views, however sometimes views require minimal css to add functionality.

            addDefaultStyle allows encaptulation of css within the View's .js file, and allows the style to be easily overriden.
        */
        addDefaultStyle: addDefaultStyle,

        /**
            ### .createSpec

                function myConstructor(){}
                myConstructor = gaffa.createSpec(myConstructor, inheritedConstructor);

            npm module: [spec-js](https://npmjs.org/package/spec-js)
        */
        createSpec: createSpec,

        /**
            ### .jsonConverter

            default jsonification for ViewItems
        */
        jsonConverter: jsonConverter,

        /**
            ### .initialiseViewItem

            takes the plain old object representation of a viewItem and returns an instance of ViewItem with all the settings applied.

            Also recurses through the ViewItem's tree and inflates children.
        */
        initialiseViewItem: function(viewItem, specCollection, references){
            return initialiseViewItem(viewItem, this, specCollection, references);
        },

        initialiseView: function(view, references){
            return initialiseView(view, this, references);
        },

        initialiseAction: function(action, references){
            return initialiseAction(action, this, references);
        },

        initialiseBehaviour: function(behaviour, references){
            return initialiseBehaviour(behaviour, this, references);
        },

        /**
            ### .initialiseViewItem

            takes the plain old object representation of a viewItem and returns an instance of ViewItem with all the settings applied.

            Also recurses through the ViewItem's tree and inflates children.
        */
        registerConstructor: function(constructor){
            if(Array.isArray(constructor)){
                for(var i = 0; i < constructor.length; i++){
                    gaffa.registerConstructor(constructor[i]);
                }
            }

            var constructorType = constructor.prototype instanceof View && 'views' ||
                constructor.prototype instanceof Action && 'actions' ||
                constructor.prototype instanceof Behaviour && 'behaviours';

            if(constructorType){
                // ToDo: Deprecate .type
                gaffa[constructorType]._constructors[constructor.prototype._type || constructor.prototype.type] = constructor;
            }else{
                throw "The provided constructor was not an instance of a View, Action, or Behaviour" +
                    "\n This is likely due to having two version of Gaffa installed" +
                    "\n Run 'npm ls gaffa' to check, and 'npm dedupe to fix'";
            }
        },

        /**
            ### .events

            used throughout gaffa for binding DOM events.
        */
        events:{

            /**
                ### .on

                usage:

                    gaffa.events.on('eventname', target, callback);
            */
            on: function(eventName, target, callback){
                if('on' + eventName.toLowerCase() in target){
                    return doc.on(eventName, target, callback);
                }
            }
        },

        /**
            ## .model

            access to the applications model
        */
        model: {

            /**
                ### .get(path, viewItem, scope, asTokens)

                used to get data from the model.
                path is relative to the viewItems path.

                    gaffa.model.get('[someProp]', parentViewItem);
            */
            get: modelGet,

            /**
                ### .set(path, value, viewItem, dirty)

                used to set data into the model.
                path is relative to the viewItems path.

                    gaffa.model.set('[someProp]', 'hello', parentViewItem);
            */
            set: modelSet,

            /**
                ### .remove(path, viewItem, dirty)

                used to remove data from the model.
                path is relative to the viewItems path.

                    gaffa.model.remove('[someProp]', parentViewItem);
            */
            remove: modelRemove,

            /**
                ### .bind(path, callback, viewItem)

                used to bind callbacks to changes in the model.
                path is relative to the viewItems path.

                    gaffa.model.bind('[someProp]', function(){
                        //do something when '[someProp]' changes.
                    }, viewItem);
            */
            bind: modelBind,

            /**
                ### .debind(viewItem)

                remove all callbacks assigned to a viewItem.

                    gaffa.model.debind('[someProp]', function(){
                        //do something when '[someProp]' changes.
                    });
            */
            debind: modelDebind,

            /**
                ### .isDirty(path, viewItem)

                check if a part of the model is dirty.
                path is relative to the viewItems path.

                    gaffa.model.isDirty('[someProp]', viewItem); // true/false?
            */
            isDirty: modelIsDirty,

            /**
                ### .setDirtyState(path, value, viewItem)

                set a part of the model to be dirty or not.
                path is relative to the viewItems path.

                    gaffa.model.setDirtyState('[someProp]', true, viewItem);
            */
            setDirtyState: modelSetDirtyState
        },

        /**
            ## .views

                gaffa.views //Object.

            contains functions and properties for manipulating the application's views.
        */
        views: {

            /**
                ### .renderTarget

                Overrideable DOM selector that top level view items will be inserted into.

                    gaffa.views.renderTarget = 'body';
            */
            renderTarget: 'body',

            /**
                ### .add(View/viewModel, insertIndex)

                Add a view or views to the root list of viewModels.
                When a view is added, it will be rendered _bound, and inserted into the DOM.

                    gaffa.views.add(myView);

                Or:

                    gaffa.views.add([
                        myView1,
                        myView1,
                        myView1
                    ]);
            */
            add: function(view, insertIndex){
                if(Array.isArray(view)){
                    for(var i = 0; i < view.length; i++) {
                        gaffa.views.add(view[i]);
                    }
                    return;
                }

                if(view.name){
                    gaffa.namedViews[view.name] = view;
                }

                view.gaffa = gaffa;
                view.parentContainer = internalViewItems;
                view.render();
                view.renderedElement.viewModel = view;
                view.bind();
                view.insert(internalViewItems, insertIndex);
            },

            /**
                ### .remove(view/views)

                Remove a view or views from anywhere in the application.

                    gaffa.views.remove(myView);
            */
            remove: removeViews,

            /**
                ### .empty()

                empty the application of all views.

                    gaffa.views.empty();
            */
            empty: function(){
                removeViews(internalViewItems);
            },

            _constructors: {}
        },

        /**
            ### .namedViews

            Storage for named views.
            Any views with a .name property will be put here, with the name as the key.

            This is used for navigation, where you can specify a view to navigate into.

            See gaffa.navitate();
        */
        namedViews: {},

        /**
            ## .actions

                gaffa.actions //Object.

            contains functions and properties for manipulating the application's actions.
        */
        actions: {

            /**
                ### .trigger(actions, parent, scope, event)

                trigger a gaffa action where:

                 - actions is an array of actions to trigger.
                 - parent is an instance of ViewItem that the action is on.
                 - scope is an arbitrary object to be passed in as scope to all expressions in the action
                 - event is an arbitrary event object that may have triggered the action, such as a DOM event.
            */
            trigger: triggerActions,

            _constructors: {}
        },

        /**
            ## .behaviours

                gaffa.behaviours //Object.

            contains functions and properties for manipulating the application's behaviours.
        */
        behaviours: {

            /**
                ### .add(behaviour)

                add a behaviour to the root of the appliaction

                    gaffa.behaviours.add(someBehaviour);
            */
            add: addBehaviour,

            _constructors: {}
        },

        utils: {
            // Get a deep property on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
            getProp: function (object, propertiesString) {
                var properties = propertiesString.split(Gaffa.pathSeparator).reverse();
                while (properties.length) {
                    var nextProp = properties.pop();
                    if (object[nextProp] !== undefined && object[nextProp] !== null) {
                        object = object[nextProp];
                    } else {
                        return;
                    }
                }
                return object;
            },
            // See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
            propExists: function (object, propertiesString) {
                var properties = propertiesString.split(".").reverse();
                while (properties.length) {
                    var nextProp = properties.pop();
                    if (object[nextProp] !== undefined && object[nextProp] !== null) {
                        object = object[nextProp];
                    } else {
                        return false;
                    }
                }
                return true;
            }
        },

        /**

            ## Navigate

            Navigates the app to a gaffa-app endpoint

                gaffa.navigate(url);

            To navigate into a named view:

                gaffa.navigate(url, target);

            Where target is: [viewName].[viewContainerName], eg:

                gaffa.navigate('/someroute', 'myPageContainer.content');

            myPageContainer would be a named ContainerView and content is the viewContainer on the view to target.
        */
        navigate: navigate,
        load: load,
        extend: merge, // DEPRICATED
        merge: merge,
        clone: clone,
        ajax: ajax,
        crel: crel,
        doc: doc,
        fastEach: fastEach,
        getClosestItem: getClosestItem,
        pushState: function(state, title, location){
            window.history.pushState(state, title, location);
        }
    };

    merge(gaffa, gaffaPublicObject);

    return gaffa;
}


// "constants"
Gaffa.pathSeparator = "/";

Gaffa.Property = Property;
Gaffa.ViewContainer = ViewContainer;
Gaffa.ViewItem = ViewItem;
Gaffa.View = View;
Gaffa.ContainerView = ContainerView;
Gaffa.Action = Action;
Gaffa.createSpec = createSpec;
Gaffa.Behaviour = Behaviour;
Gaffa.addDefaultStyle = addDefaultStyle;

module.exports = Gaffa;

///[license.md]
