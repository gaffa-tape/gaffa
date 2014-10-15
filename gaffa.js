//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

///[README.md]

"use strict";

var Gedi = require('gedi'),
    doc = require('doc-js'),
    createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    merge = require('merge'),
    statham = require('statham'),
    resolvePath = require('./resolvePath'),
    removeViews = require('./removeViews'),
    getClosestItem = require('./getClosestItem'),
    jsonConverter = require('./jsonConverter'),
    Property = require('./property'),
    ViewContainer = require('./viewContainer'),
    ViewItem = require('./viewItem'),
    View = require('./view'),
    ContainerView = require('./containerView'),
    Action = require('./action'),
    Behaviour = require('./behaviour'),
    initialiseViewItem = require('./initialiseViewItem'),
    initialiseView = require('./initialiseView'),
    initialiseAction = require('./initialiseAction'),
    initialiseBehaviour = require('./initialiseBehaviour');

function clone(value){
    return statham.revive(value);
}

function Gaffa(){
    var gedi,
        gaffa = this;

    this.gaffa = this;

    // internal varaibles

        // Storage for the applications model.
    var internalModel = {},

        // Storage for the applications view.
        rootViewContainer = new ViewContainer(),

        // Storage for application actions.
        internalActions = {},

        // Storage for application behaviours.
        internalBehaviours = [],

        // Storage for interval based behaviours.
        internalIntervals = [];

    rootViewContainer.gaffa = this;
    rootViewContainer.renderTarget = 'body';

    if(typeof window !== 'undefined'){
        doc.ready(function(){
            gaffa._bound = true;
            rootViewContainer.bind(gaffa);
        });
    }

    // Gedi initialisation
    gedi = new Gedi(internalModel);

    // Add gedi instance to gaffa.
    this.gedi = gedi;

    function modelGet(path, viewItem, scope, asTokens) {
        if(!(viewItem instanceof ViewItem || viewItem instanceof Property)){
            scope = viewItem;
            viewItem = undefined;
        }

        scope = scope || {};

        var parentPath = resolvePath(viewItem);

        return gedi.get(path, parentPath, scope, asTokens);
    }

    function modelSet(expression, value, viewItem, dirty, scope){
        if(expression == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        if(typeof expression === 'object'){
            value = expression;
            expression = '[]';
        }

        gedi.set(expression, value, parentPath, dirty, scope);
    }

    function modelRemove(expression, viewItem, dirty, scope) {
        var parentPath;

        if(expression == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        gedi.remove(expression, parentPath, dirty, scope);
    }

    function modelIsDirty(path, viewItem) {
        if(path == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        return gedi.isDirty(path, parentPath);
    }

    function modelSetDirtyState(expression, value, viewItem, scope) {
        if(expression == null){
            return;
        }

        var parentPath = resolvePath(viewItem);

        gedi.setDirtyState(expression, value, parentPath, scope);
    }


/**
    ## The gaffa instance

    Instance of Gaffa

        var gaffa = new Gaffa();
*/

    /**
        ### .events

        used throughout gaffa for binding DOM events.
    */
    this.events = {

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
    };

    /**
        ## .model

        access to the applications model
    */
    this.model = {

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
    };

    /**
        ## .views

            gaffa.views // ViewContainer.

        the Gaffa instances top viewContainer.
    */
    this.views = rootViewContainer;

    /**
        ## .actions

            gaffa.actions // Object.

        contains functions and properties for manipulating the application's actions.
    */
    this.actions = {

        /**
            ### .trigger(actions, parent, scope, event)

            trigger a gaffa action where:

             - actions is an array of actions to trigger.
             - parent is an instance of ViewItem that the action is on.
             - scope is an arbitrary object to be passed in as scope to all expressions in the action
             - event is an arbitrary event object that may have triggered the action, such as a DOM event.
        */
        trigger: Action.trigger,

    };
    this._constructors = {
        views: {},
        actions: {},
        behaviours: {}
    };
}
Gaffa.prototype = Object.create(EventEmitter.prototype);
Gaffa.prototype.constructor = Gaffa;
Gaffa.prototype.merge = merge;
Gaffa.prototype.clone = clone;
Gaffa.prototype.getClosestItem = getClosestItem;
Gaffa.prototype.browser = require('bowser');
Gaffa.prototype.ajax = function(settings){
    console.warn('Ajax: This API is depricated and will be removed in a later version. Use a standalone module for XHR.');

    var ajax = new (require('simple-ajax'))(settings);

    ajax.on('complete', function(event){
        var data,
            error;

        try{
            data = JSON.parse(event.target.responseText);
        }catch(error){
            error = error;
        }

        if(event.status <200 || event.status > 400){
            error = data || error;
        }

        !error && settings.success && settings.success(data);
        error && settings.error && settings.error(error);
        settings.complete && settings.complete(event);
    });

    ajax.send();
};
Gaffa.prototype.utils = {
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
};

/**
    ### .initialiseViewItem

    takes the plain old object representation of a viewItem and returns an instance of ViewItem with all the settings applied.

    Also recurses through the ViewItem's tree and inflates children.
*/
Gaffa.prototype.initialiseViewItem = function(viewItem, specCollection, references){
    return initialiseViewItem(viewItem, this, specCollection, references);
};

Gaffa.prototype.initialiseView = function(view, references){
    return initialiseView(view, this, references);
};

Gaffa.prototype.initialiseAction = function(action, references){
    return initialiseAction(action, this, references);
};

Gaffa.prototype.initialiseBehaviour = function(behaviour, references){
    return initialiseBehaviour(behaviour, this, references);
};

Gaffa.prototype.registerConstructor = function(constructor){
    if(Array.isArray(constructor)){
        for(var i = 0; i < constructor.length; i++){
            this.registerConstructor(constructor[i]);
        }
    }

    var constructorType = constructor.prototype instanceof View && 'views' ||
        constructor.prototype instanceof Action && 'actions' ||
        constructor.prototype instanceof Behaviour && 'behaviours';

    if(constructorType){
        // ToDo: Deprecate .type
        this._constructors[constructorType][constructor.prototype._type || constructor.prototype.type] = constructor;
    }else{
        throw "The provided constructor was not an instance of a View, Action, or Behaviour" +
            "\n This is likely due to having two version of Gaffa installed" +
            "\n Run 'npm ls gaffa' to check, and 'npm dedupe to fix'";
    }
};

/**
    ### .createSpec

        function myConstructor(){}
        myConstructor = gaffa.createSpec(myConstructor, inheritedConstructor);

    npm module: [spec-js](https://npmjs.org/package/spec-js)
*/
Gaffa.prototype.createSpec = createSpec;

/**
    ### .jsonConverter

    default jsonification for ViewItems
*/
Gaffa.prototype.jsonConverter = jsonConverter;


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

module.exports = Gaffa;

///[license.md]
