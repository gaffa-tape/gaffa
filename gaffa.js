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
    deepEqual = require('deep-equal'),
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

//internal functions


//http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
//changed to a single array argument
String.prototype.format = function (values) {
    return this.replace(/{(\d+)}/g, function (match, number) {
        return (values[number] == undefined || values[number] == null) ? match : values[number];
    }).replace(/{(\d+)}/g, "");
};

//http://stackoverflow.com/questions/5346158/parse-string-using-format-template
//Haxy de-formatter
String.prototype.deformat = function (template) {

    var findFormatNumbers = /{(\d+)}/g,
        currentMatch,
        matchOrder = [],
        index = 0;

    while ((currentMatch = findFormatNumbers.exec(template)) != null) {
        matchOrder[index] = parseInt(currentMatch[1]);
        index++;
    }

    //http://simonwillison.net/2006/Jan/20/escape/
    var pattern = new RegExp("^" + template.replace(/[-[\]()*+?.,\\^$|#\s]/g, "\\$&").replace(/(\{\d+\})/g, "(.*?)") + "$", "g");

    var matches = pattern.exec(this);

    if (!matches) {
        return false;
    }

    var values = [];

    for (var i = 0; i < matchOrder.length; i++) {
        values.push(matches[matchOrder[i] + 1]);
    }

    return values;
};


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


function langify(fn, context){
    return function(scope, args){
        var args = args.all();

        return fn.apply(context, args);
    }
}


function getDistinctGroups(gaffa, collection, expression){
    var distinctValues = {},
        values = gaffa.model.get('(map items ' + expression + ')', {items: collection});

    if(collection && typeof collection === "object"){
        if(Array.isArray(collection)){
            for(var i = 0; i < values.length; i++) {
                distinctValues[values[i]] = null;
            }
        }else{
            throw "Object collections are not currently supported";
        }
    }

    return Object.keys(distinctValues);
}



function deDom(node){
    var parent = node.parentNode,
        nextSibling;

    if(!parent){
        return false;
    }

    nextSibling = node.nextSibling;

    parent.removeChild(node);

    return function(){
        if(nextSibling){
            parent.insertBefore(node, nextSibling && nextSibling.parent && nextSibling);
        }else {
            parent.appendChild(node);
        }
    };
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


function insertFunction(selector, renderedElement, insertIndex){
    var target = ((typeof selector === "string") ? document.querySelectorAll(selector)[0] : selector),
        referenceSibling;

    if(target && target.childNodes){
        referenceSibling = target.childNodes[insertIndex];
    }
    if (referenceSibling){
        target.insertBefore(renderedElement, referenceSibling);
    }  else {
        target.appendChild(renderedElement);
    }
}


function getItemPath(item){
    var gedi = item.gaffa.gedi,
        paths = [],
        referencePath,
        referenceItem = item;

    while(referenceItem){

        // item.path should be a child ref after item.sourcePath
        if(referenceItem.path != null){
            paths.push(referenceItem.path);
        }

        // item.sourcePath is most root level path
        if(referenceItem.sourcePath != null){
            paths.push(gedi.paths.create(referenceItem.sourcePath));
        }

        referenceItem = referenceItem.parent;
    }

    return gedi.paths.resolve.apply(this, paths.reverse());
}

function sameAs(a,b){
    var typeofA = typeof a,
        typeofB = typeof b;

    if(typeofA !== typeofB){
        return false;
    }

    switch (typeof a){
        case 'string': return a === b;

        case 'number':
            if(isNaN(a) && isNaN(b)){
                return true;
            }
            return a === b;

        case 'date': return +a === +b;

        default: return false;
    }
}


function addDefaultStyle(style){
    defaultViewStyles = defaultViewStyles || (function(){
        defaultViewStyles = crel('style', {type: 'text/css', 'class':'dropdownDefaultStyle'});

        //Prepend so it can be overriden easily.
        var addToHead = function(){
            if(window.document.head){
                window.document.head.insertBefore(defaultViewStyles);
            }else{
                setTimeout(addToHead, 100);
            }
        };

        addToHead();

        return defaultViewStyles;
    })();

    if (defaultViewStyles.styleSheet) {   // for IE
        defaultViewStyles.styleSheet.cssText = style;
    } else {                // others
        defaultViewStyles.innerHTML += style;
    }

}


function initialiseViewItem(viewItem, gaffa, specCollection, references) {
    references = references || {
        objects: [],
        viewItems: []
    };

    // ToDo: Deprecate .type
    var viewItemType = viewItem._type || viewItem.type;

    if(!(viewItem instanceof ViewItem)){
        if (!specCollection[viewItemType]) {
            throw "No constructor is loaded to handle view of type " + viewItemType;
        }

        var referenceIndex = references.objects.indexOf(viewItem);
        if(referenceIndex >= 0){
            return references.viewItems[referenceIndex];
        }

        references.objects.push(viewItem);
        viewItem = new specCollection[viewItemType](viewItem);
        references.viewItems.push(viewItem);
    }

    for(var key in viewItem.views){
        if(!(viewItem.views[key] instanceof ViewContainer)){
            viewItem.views[key] = new ViewContainer(viewItem.views[key]);
        }
        var views = viewItem.views[key];
        for (var viewIndex = 0; viewIndex < views.length; viewIndex++) {
            var view = initialiseView(views[viewIndex], gaffa, references);
            views[viewIndex] = view;
            view.parentContainer = views;
        }
    }

    for(var key in viewItem.actions){
        var actions = viewItem.actions[key];
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
            var action = initialiseAction(actions[actionIndex], gaffa, references);
            actions[actionIndex] = action;
            action.parentContainer = actions;
        }
    }

    if(viewItem.behaviours){
        for (var behaviourIndex = 0; behaviourIndex < viewItem.behaviours.length; behaviourIndex++) {
            var behaviour = initialiseBehaviour(viewItem.behaviours[behaviourIndex], gaffa, references);
            viewItem.behaviours[behaviourIndex] = behaviour;
            behaviour.parentContainer = viewItem.behaviours;
        }
    }

    return viewItem;
}


function initialiseView(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.views._constructors, references);
}


function initialiseAction(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.actions._constructors, references);
}


function initialiseBehaviour(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.behaviours._constructors, references);
}


function removeViews(views){
    if(!views){
        return;
    }

    views = views instanceof Array ? views : [views];

    views = views.slice();

    for(var i = 0; i < views.length; i++) {
        views[i].remove();
    }
}


function jsonConverter(object, exclude, include){
    var plainInstance = new object.constructor(),
        tempObject = Array.isArray(object) || object instanceof Array && [] || {},
        excludeProps = ["gaffa", "parent", "parentContainer", "renderedElement", "_removeHandlers", "gediCallbacks", "__super__", "_events"],
        includeProps = ["type", "_type"];

    //console.log(object.constructor.name);

    if(exclude){
        excludeProps = excludeProps.concat(exclude);
    }

    if(include){
        includeProps = includeProps.concat(include);
    }

    for(var key in object){
        if(
            includeProps.indexOf(key)>=0 ||
            object.hasOwnProperty(key) &&
            excludeProps.indexOf(key)<0 &&
            !deepEqual(plainInstance[key], object[key])
        ){
            tempObject[key] = object[key];
        }
    }

    if(!Object.keys(tempObject).length){
        return;
    }

    return tempObject;
}


function createModelScope(parent, gediEvent){
    var possibleGroup = parent,
        groupKey;

    while(possibleGroup && !groupKey){
        groupKey = possibleGroup.group;
        possibleGroup = possibleGroup.parent;
    }

    return {
        viewItem: parent,
        groupKey: groupKey,
        modelTarget: gediEvent && gediEvent.target
    };
}


function updateProperty(property, firstUpdate){
    // Update immediately, reduces reflows,
    // as things like classes are added before
    //  the element is inserted into the DOM
    if(firstUpdate){
        property.update(property.parent, property.value);
    }

    // Still run the sameAsPrevious function,
    // because it sets up the last value hash,
    // and it will be false anyway.
    if(!property.sameAsPrevious() && !property.nextUpdate){
        if(property.gaffa.debug){
            property.update(property.parent, property.value);
            return;
        }
        property.nextUpdate = requestAnimationFrame(function(){
            property.update(property.parent, property.value);
            property.nextUpdate = null;
        });
    }
}


function createPropertyCallback(property){
    return function (event) {
        var value,
            scope,
            valueTokens;

        if(event){

            scope = createModelScope(property.parent, event);

            if(event === true){ // Initial update.

                valueTokens = property.get(scope, true);

            }else if(event.captureType === 'bubble' && property.ignoreBubbledEvents){

                return;

            }else if(property.binding){ // Model change update.

                if(property.ignoreTargets && event.target.toString().match(property.ignoreTargets)){
                    return;
                }

                valueTokens = property.get(scope, true);
            }

            if(valueTokens){
                var valueToken = valueTokens[valueTokens.length - 1];
                value = valueToken.result;
                property._sourcePathInfo = valueToken.sourcePathInfo;
            }

            property.value = value;
        }

        // Call the properties update function, if it has one.
        // Only call if the changed value is an object, or if it actually changed.
        if(!property.update){
            return;
        }

        updateProperty(property, event === true);
    }
}


function bindProperty(parent) {
    this.parent = parent;

    // Shortcut for properties that have no binding.
    // This has a significant impact on performance.
    if(this.binding == null){
        if(this.update){
            this.update(parent, this.value);
        }
        return;
    }

    var propertyCallback = createPropertyCallback(this);

    this.gaffa.model.bind(this.binding, propertyCallback, this);
    propertyCallback(true);
}


//Public Objects ******************************************************************************

function createValueHash(value){
    if(value && typeof value === 'object'){
        return Object.keys(value);
    }

    return value;
}


function compareToHash(value, hash){
    if(value && hash && typeof value === 'object' && typeof hash === 'object'){
        var keys = Object.keys(value);
        if(keys.length !== hash.length){
            return;
        }
        for (var i = 0; i < hash.length; i++) {
            if(hash[i] !== keys[i]){
                return;
            }
        };
        return true;
    }

    return value === hash;
}


function Property(propertyDescription){
    if(typeof propertyDescription === 'function'){
        this.update = propertyDescription;
    }else{
        for(var key in propertyDescription){
            this[key] = propertyDescription[key];
        }
    }

    this.gediCallbacks = [];
}
Property = createSpec(Property);
Property.prototype.set = function(value, isDirty){
    var gaffa = this.gaffa;

    if(this.binding){
        var setValue = this.setTransform ? gaffa.model.get(this.setTransform, this, {value: value}) : value;
        gaffa.model.set(
            this.binding,
            setValue,
            this,
            isDirty
        );
    }else{
        this.value = value;
        this._previousHash = createValueHash(value);
        if(this.update){
            this.update(this.parent, value);
        }
    }

};
Property.prototype.get = function(scope, asTokens){
    if(this.binding){
        var value = this.gaffa.model.get(this.binding, this, scope, asTokens);
        if(this.getTransform){
            scope.value = asTokens ? value[value.length-1].result : value;
            return this.gaffa.model.get(this.getTransform, this, scope, asTokens);
        }
        return value;
    }else{
        return this.value;
    }
};
Property.prototype.sameAsPrevious = function () {
    if(compareToHash(this.value, this._previousHash)){
        return true;
    }
    this._previousHash = createValueHash(this.value);
};
Property.prototype.setPreviousHash = function(hash){
    this._previousHash = hash;
};
Property.prototype.getPreviousHash = function(hash){
    return this._previousHash;
};
Property.prototype.bind = bindProperty;
Property.prototype.debind = function(){
    cancelAnimationFrame(this.nextUpdate);
    this.gaffa && this.gaffa.model.debind(this);
};
Property.prototype.getPath = function(){
    return getItemPath(this);
};
Property.prototype.toJSON = function(){
    var tempObject = jsonConverter(this, ['_previousHash']);

    return tempObject;
};


function ViewContainer(viewContainerDescription){
    var viewContainer = this;

    this._deferredViews = [];

    if(viewContainerDescription instanceof Array){
        viewContainer.add(viewContainerDescription);
    }
}
ViewContainer = createSpec(ViewContainer, Array);
ViewContainer.prototype.bind = function(parent){
    this.parent = parent;
    this.gaffa = parent.gaffa;

    if(this._bound){
        return;
    }

    this._bound = true;

    for(var i = 0; i < this.length; i++){
        this.add(this[i], i);
    }

    return this;
};
ViewContainer.prototype.debind = function(){
    if(!this._bound){
        return;
    }

    this._bound = false;

    for (var i = 0; i < this.length; i++) {
        this[i].detach();
        this[i].debind();
    }
};
ViewContainer.prototype.getPath = function(){
    return getItemPath(this);
};

/*
    ViewContainers handle their own array state.
    A View that is added to a ViewContainer will
    be automatically removed from its current
    container, if it has one.
*/
ViewContainer.prototype.add = function(view, insertIndex){
    // If passed an array
    if(Array.isArray(view)){
        for(var i = 0; i < view.length; i++){
            this.add(view[i]);
        }
        return this;
    }

    // Is already in the tree somewhere? remove it.
    if(view.parentContainer){
        view.parentContainer.splice(view.parentContainer.indexOf(view),1);
    }

    this.splice(insertIndex >= 0 ? insertIndex : this.length,0,view);

    view.parentContainer = this;

    if(this._bound){
        if(!(view instanceof View)){
            view = this[this.indexOf(view)] = initialiseViewItem(view, this.gaffa, this.gaffa.views._constructors);
        }
        view.gaffa = this.gaffa;

        this.gaffa.namedViews[view.name] = view;

        if(!view.renderedElement){
            view.render();
            view.renderedElement.viewModel = view;
        }
        view.bind(this.parent);
        view.insert(this, insertIndex);
    }


    return this;
};

/*
    adds 5 (5 is arbitrary) views at a time to the target viewContainer,
    then queues up another add.
*/
function executeDeferredAdd(viewContainer){
    var currentOpperation = viewContainer._deferredViews.splice(0,5);

    if(!currentOpperation.length){
        return;
    }

    for (var i = 0; i < currentOpperation.length; i++) {
        viewContainer.add(currentOpperation[i][0], currentOpperation[i][1]);
    };
    requestAnimationFrame(function(time){
        executeDeferredAdd(viewContainer);
    });
}

/*
    Adds children to the view container over time, via RAF.
    Will only begin the render cycle if there are no _deferredViews,
    because if _deferredViews.length is > 0, the render loop will
    already be going.
*/
ViewContainer.prototype.deferredAdd = function(view, insertIndex){
    var viewContainer = this,
        shouldStart = !this._deferredViews.length;

    this._deferredViews.push([view, insertIndex]);

    if(shouldStart){
        requestAnimationFrame(function(){
            executeDeferredAdd(viewContainer);
        });
    }
};

ViewContainer.prototype.abortDeferredAdd = function(){
    this._deferredViews = [];
};
ViewContainer.prototype.remove = function(viewModel){
    viewModel.remove();
};
ViewContainer.prototype.empty = function(){
    removeViews(this);
};
ViewContainer.prototype.toJSON = function(){
    return jsonConverter(this, ['element']);
};


function copyProperties(source, target){
    if(
        !source || typeof source !== 'object' ||
        !target || typeof target !== 'object'
    ){
        return;
    }

    for(var key in source){
        if(source.hasOwnProperty(key)){
            target[key] = source[key];
        }
    }
}


function debindViewItem(viewItem){
    for(var key in viewItem){
        if(viewItem[key] instanceof Property){
            viewItem[key].debind();
        }
    }
    viewItem.emit('debind');
    viewItem._bound = false;
}


function removeViewItem(viewItem){
    if(!viewItem.parentContainer){
        return;
    }

    if(viewItem.parentContainer){
        viewItem.parentContainer.splice(viewItem.parentContainer.indexOf(viewItem), 1);
        viewItem.parentContainer = null;
    }

    viewItem.debind();

    viewItem.emit('remove');
}


/**
    ## ViewItem

    The base constructor for all gaffa ViewItems.

    Views, Behaviours, and Actions inherrit from ViewItem.
*/
function ViewItem(viewItemDescription){

    for(var key in this){
        if(this[key] instanceof Property){
            this[key] = new this[key].constructor(this[key]);
        }
    }

    /**
        ## .actions

        All ViewItems have an actions object which can be overriden.

        The actions object looks like this:

            viewItem.actions = {
                click: [action1, action2],
                hover: [action3, action4]
            }

        eg:

            // Some ViewItems
            var someButton = new views.button(),
                removeItem = new actions.remove();

            // Set removeItem as a child of someButton.
            someButton.actions.click = [removeItem];

        If a Views action.[name] matches a DOM event name, it will be automatically _bound.

            myView.actions.click = [
                // actions to trigger when a 'click' event is raised by the views renderedElement
            ];
    */
    this.actions = this.actions ? clone(this.actions) : {};

    for(var key in viewItemDescription){
        var prop = this[key];
        if(prop instanceof Property || prop instanceof ViewContainer){
            copyProperties(viewItemDescription[key], prop);
        }else{
            this[key] = viewItemDescription[key];
        }
    }
}
ViewItem = createSpec(ViewItem, EventEmitter);

    /**
        ## .path

        the base path for a viewItem.

        Any bindings on a ViewItem will recursivly resolve through the ViewItems parent's paths.

        Eg:

            // Some ViewItems
            var viewItem1 = new views.button(),
                viewItem2 = new actions.set();

            // Give viewItem1 a path.
            viewItem1.path = '[things]';
            // Set viewItem2 as a child of viewItem1.
            viewItem1.actions.click = [viewItem2];

            // Give viewItem2 a path.
            viewItem2.path = '[stuff]';
            // Set viewItem2s target binding.
            viewItem2.target.binding = '[majigger]';

        viewItem2.target.binding will resolve to:

            '[/things/stuff/majigger]'
    */
ViewItem.prototype.path = '[]';
ViewItem.prototype.bind = function(parent){
    var viewItem = this,
        property;

    this.parent = parent;

    this._bound = true;

    // Only set up properties that were on the prototype.
    // Faster and 'safer'
    for(var propertyKey in this.constructor.prototype){
        property = this[propertyKey];
        if(property instanceof Property){
            property.gaffa = viewItem.gaffa;
            property.bind(this);
        }
    }
};
ViewItem.prototype.debind = function(){
    debindViewItem(this);
};
ViewItem.prototype.remove = function(){
    removeViewItem(this);
};
ViewItem.prototype.getPath = function(){
    return getItemPath(this);
};
ViewItem.prototype.getDataAtPath = function(){
    if(!this.gaffa){
        return;
    }
    return this.gaffa.model.get(getItemPath(this));
};
ViewItem.prototype.toJSON = function(){
    return jsonConverter(this);
};
ViewItem.prototype.triggerActions = function(actionName, scope, event){
    if(!this.gaffa){
        return;
    }
    this.gaffa.actions.trigger(this.actions[actionName], this, scope, event);
};


function createEventedActionScope(view, event){
    var scope = createModelScope(view);

    scope.event = {
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        which: event.which,
        target: event.target,
        targetViewItem: getClosestItem(event.target),
        preventDefault: langify(event.preventDefault, event),
        stopPropagation: langify(event.stopPropagation, event)
    };

    return scope;
}


function bindViewEvent(view, eventName){
    return view.gaffa.events.on(eventName, view.renderedElement, function (event) {
        triggerActions(view.actions[eventName], view, createEventedActionScope(view, event), event);
    });
}


/**
    ## View

    A base constructor for gaffa Views that have content view.

    All Views that inherit from ContainerView will have:

        someView.views.content
*/
function View(viewDescription){
    var view = this;

    view._removeHandlers = [];
    view.behaviours = view.behaviours || [];
}
View = createSpec(View, ViewItem);

View.prototype.bind = function(parent){
    ViewItem.prototype.bind.apply(this, arguments);

    for(var key in this.actions){
        var actions = this.actions[key],
            off;

        if(actions.__bound){
            continue;
        }

        actions.__bound = true;

        off = bindViewEvent(this, key);

        if(off){
            this._removeHandlers.push(off);
        }
    }

    this.triggerActions('load');

    for(var i = 0; i < this.behaviours.length; i++){
        this.behaviours[i].gaffa = this.gaffa;
        Behaviour.prototype.bind.call(this.behaviours[i], this);
        this.behaviours[i].bind(this);
    }
};

View.prototype.detach = function(){
    this.renderedElement && this.renderedElement.parentNode && this.renderedElement.parentNode.removeChild(this.renderedElement);
};

View.prototype.remove = function(){
    this.detach();
    removeViewItem(this);
}

View.prototype.debind = function () {
    for(var i = 0; i < this.behaviours.length; i++){
        this.behaviours[i].debind();
    }

    this.triggerActions('unload');

    while(this._removeHandlers.length){
        this._removeHandlers.pop()();
    }
    for(var key in this.actions){
        this.actions[key].__bound = false;
    }

    debindViewItem(this);
};

View.prototype.render = function(){};

function insert(view, viewContainer, insertIndex){
    var gaffa = view.gaffa,
        renderTarget = view.insertSelector || view.renderTarget || viewContainer && viewContainer.element || gaffa.views.renderTarget;

    if(view.afterInsert){
        laidout(view.renderedElement, function(){
            view.afterInsert();
        });
    }

    if(viewContainer.indexOf(view) !== insertIndex){
        viewContainer.splice(insertIndex, 1, view);
    }

    view.insertFunction(view.insertSelector || renderTarget, view.renderedElement, insertIndex);
}

View.prototype.insert = function(viewContainer, insertIndex){
    insert(this, viewContainer, insertIndex);
};

function Classes(){};
Classes = createSpec(Classes, Property);
Classes.prototype.update = function(view, value){
    doc.removeClass(view.renderedElement, this._previousClasses);
    this._previousClasses = value;
    doc.addClass(view.renderedElement, value);
};
View.prototype.classes = new Classes();

function Visible(){};
Visible = createSpec(Visible, Property);
Visible.prototype.value = true;
Visible.prototype.update = function(view, value) {
    view.renderedElement.style.display = value ? '' : 'none';
};
View.prototype.visible = new Visible();

function Enabled(){};
Enabled = createSpec(Enabled, Property);
Enabled.prototype.value = true;
Enabled.prototype.update = function(view, value) {
    if(!value === !!view.renderedElement.getAttribute('disabled')){
        return;
    }
    view.renderedElement[!value ? 'setAttribute' : 'removeAttribute']('disabled','disabled');
};
View.prototype.enabled = new Enabled();

function Title(){};
Title = createSpec(Title, Property);
Title.prototype.update = function(view, value) {
    view.renderedElement[value ? 'setAttribute' : 'removeAttribute']('title',value);
};
View.prototype.title = new Title();

View.prototype.insertFunction = insertFunction;


/**
    ## ContainerView

    A base constructor for gaffa Views that can hold child views.

    All Views that inherit from ContainerView will have:

        someView.views.content
*/
function ContainerView(viewDescription){
    this.views = this.views || {};
    this.views.content = new ViewContainer(this.views.content);
}
ContainerView = createSpec(ContainerView, View);
ContainerView.prototype.bind = function(parent){
    View.prototype.bind.apply(this, arguments);
    for(var key in this.views){
        var viewContainer = this.views[key];

        if(viewContainer instanceof ViewContainer){
            viewContainer.bind(this);
        }
    }
};
ContainerView.prototype.debind = function(){
    View.prototype.debind.apply(this, arguments);
    for(var key in this.views){
        var viewContainer = this.views[key];

        if(viewContainer instanceof ViewContainer){
            viewContainer.debind();
        }
    }
};


function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.prototype.bind = function(){
    ViewItem.prototype.bind.call(this);
};
Action.prototype.trigger = function(parent, scope, event){
    this.parent = parent;

    scope = scope || {};

    var gaffa = this.gaffa = parent.gaffa;


    for(var propertyKey in this.constructor.prototype){
        var property = this[propertyKey];

        if(property instanceof Property && property.binding){
            property.gaffa = gaffa;
            property.parent = this;
            property.value = property.get(scope);
        }
    }

    this.debind();
};


function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);
Behaviour.prototype.toJSON = function(){
    return jsonConverter(this);
};


function Gaffa(){


    var gedi,
        gaffa = {};


    // internal varaibles

        // Storage for the applications model.
    var internalModel = {},

        // Storage for the applications view.
        internalViewItems = [],

        // Storage for application actions.
        internalActions = {},

        // Storage for application behaviours.
        internalBehaviours = [],

        // Storage for application notifications.
        internalNotifications = {},

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


    function addNotification(kind, callback){
        internalNotifications[kind] = internalNotifications[kind] || [];
        internalNotifications[kind].push(callback);
    }


    function callbackNotification(notifications, data){
        for(var i = 0; i < notifications.length; i++) {
            notifications[i](data);
        }
    }

    function notify(kind, data){
        var subKinds = kind.split(".");

        for(var i = 0; i < subKinds.length; i++) {
            var notificationKind = subKinds.slice(0, i + 1).join(".");

            if(internalNotifications[notificationKind]){
                callbackNotification(internalNotifications[notificationKind]);
            }
        }
    }


    function queryStringToModel(){
        var queryStringData = parseQueryString(window.location.search);

        for(var key in queryStringData){
            if(!queryStringData.hasOwnProperty(key)){
                continue;
            }

            if(queryStringData[key]){
                gaffa.model.set(key, queryStringData[key]);
            }else{
                gaffa.model.set(key, null);
            }
        }
    }


    function load(app, target){

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

        queryStringToModel();
    }


    var pageCache = {};

    function navigate(url, target, pushState, data) {

        // Data will be passed to the route as a querystring
        // but will not be displayed visually in the address bar.
        // This is to help resolve caching issues.

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

            pageCache[url] = JSON.stringify(data);

            gaffa.load(data, target);

            gaffa.notifications.notify("navigation.success");

            window.scrollTo(0,0);
        }

        function error(error){
            gaffa.notifications.notify("navigation.error", error);
        }

        function complete(){
            gaffa.notifications.notify("navigation.complete");
        }

        gaffa.notifications.notify("navigation.begin");

        if(gaffa.cacheNavigates !== false && pageCache[url]){
            success(JSON.parse(pageCache[url]));
            complete();
            return;
        }

        gaffa.ajax({
            headers:{
                'x-gaffa': 'navigate'
            },
            cache: navigator.appName !== 'Microsoft Internet Explorer',
            url: url,
            type: "get",
            data: data, // This is to avoid the cached HTML version of a page if you are bootstrapping.
            dataType: "json",
            success: success,
            error: error,
            complete: complete
        });
    }


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
        initialiseViewItem: initialiseViewItem,

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
                throw "The provided constructor was not an instance of a View, Action, or Behaviour";
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
            get:function(path, viewItem, scope, asTokens) {
                if(!(viewItem instanceof ViewItem || viewItem instanceof Property)){
                    scope = viewItem;
                    viewItem = undefined;
                }

                var parentPath;
                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                scope = scope || {};

                addDefaultsToScope(scope);
                return gedi.get(path, parentPath, scope, asTokens);
            },

            /**
                ### .set(path, value, viewItem, dirty)

                used to set data into the model.
                path is relative to the viewItems path.

                    gaffa.model.set('[someProp]', 'hello', parentViewItem);
            */
            set:function(path, value, viewItem, dirty) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                gedi.set(path, value, parentPath, dirty);
            },

            /**
                ### .remove(path, viewItem, dirty)

                used to remove data from the model.
                path is relative to the viewItems path.

                    gaffa.model.remove('[someProp]', parentViewItem);
            */
            remove: function(path, viewItem, dirty) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                gedi.remove(path, parentPath, dirty);
            },

            /**
                ### .bind(path, callback, viewItem)

                used to bind callbacks to changes in the model.
                path is relative to the viewItems path.

                    gaffa.model.bind('[someProp]', function(){
                        //do something when '[someProp]' changes.
                    }, viewItem);
            */
            bind: function(path, callback, viewItem) {
                var parentPath;

                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                if(!viewItem.gediCallbacks){
                    viewItem.gediCallbacks = [];
                }

                // Add the callback to the list of handlers associated with the viewItem
                viewItem.gediCallbacks.push(function(){
                    gedi.debind(callback);
                });

                gedi.bind(path, callback, parentPath);
            },

            /**
                ### .debind(viewItem)

                remove all callbacks assigned to a viewItem.

                    gaffa.model.debind('[someProp]', function(){
                        //do something when '[someProp]' changes.
                    });
            */
            debind: function(viewItem) {
                while(viewItem.gediCallbacks && viewItem.gediCallbacks.length){
                    viewItem.gediCallbacks.pop()();
                }
            },

            /**
                ### .isDirty(path, viewItem)

                check if a part of the model is dirty.
                path is relative to the viewItems path.

                    gaffa.model.isDirty('[someProp]', viewItem); // true/false?
            */
            isDirty: function(path, viewItem) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                return gedi.isDirty(path, parentPath);
            },

            /**
                ### .setDirtyState(path, value, viewItem)

                set a part of the model to be dirty or not.
                path is relative to the viewItems path.

                    gaffa.model.setDirtyState('[someProp]', true, viewItem);
            */
            setDirtyState: function(path, value, viewItem) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(viewItem && viewItem.getPath){
                    parentPath = viewItem.getPath();
                }

                gedi.setDirtyState(path, value, parentPath);
            }
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
            //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
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
            //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
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
            },
            deDom: deDom
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

        notifications:{
            add: addNotification,
            notify: notify
        },

        load: load,

        //If you want to load the values in query strings into the pages model.
        queryStringToModel: queryStringToModel,

        //This is here so i can remove it later and replace with a better verson.
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

Gaffa.propertyUpdaters = {
    group: function (viewsName, insert, remove, empty) {
        return function (viewModel, value) {
            var property = this,
                gaffa = property.gaffa,
                childViews = viewModel.views[viewsName],
                previousGroups = property.previousGroups,
                newView,
                isEmpty;

            if (value && typeof value === "object"){

                viewModel.distinctGroups = getDistinctGroups(gaffa, property.value, property.expression);

                if(previousGroups){
                    if(previousGroups.length === viewModel.distinctGroups.length){
                        return;
                    }
                    var same = true;
                    for(var i = 0; i < previousGroups.length; i++) {
                        var group = previousGroups[i];
                        if(group !== viewModel.distinctGroups[group]){
                            same = false;
                        }
                    }
                    if(same){
                        return;
                    }
                }

                property.previousGroups = viewModel.distinctGroups;


                for(var i = 0; i < childViews.length; i++){
                    var childView = childViews[i];
                    if(viewModel.distinctGroups.indexOf(childView.group)<0){
                        childViews.splice(i, 1);
                        i--;
                        remove(viewModel, value, childView);
                    }
                }
                for(var i = 0; i < viewModel.distinctGroups.length; i++) {
                    var group = viewModel.distinctGroups[i];
                    var exists = false;
                    for(var i = 0; i < childViews.length; i++) {
                        if(child.group === childViews[i]){
                            exists = true;
                        }
                    }

                    if (!exists) {
                        newView = {group: group};
                        insert(viewModel, value, newView);
                    }
                }

                isEmpty = !childViews.length;

                empty(viewModel, isEmpty);
            }else{
                for(var i = 0; i < childViews.length; i++) {
                    childViews.splice(index, 1);
                    remove(viewModel, property.value, childViews[i]);
                }
            }
        };
    }
};

module.exports = Gaffa;

///[license.md]
