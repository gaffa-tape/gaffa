//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

"use strict";

var Gedi = require('gedi'),
    doc = require('doc-js'),
    crel = require('crel'),
    fastEach = require('fasteach'),
    deepEqual = require('deep-equal'),
    animationFrame = require('./raf.js'),
    requestAnimationFrame = animationFrame.requestAnimationFrame,
    cancelAnimationFrame = animationFrame.cancelAnimationFrame;

// Storage for applications default styles.
var defaultViewStyles;

//internal functions

//***********************************************
//
//      Object.create polyfill
//      https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
//
//***********************************************

Object.create = Object.create || function (o) {
    if (arguments.length > 1) {
        throw new Error('Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
};


//***********************************************
//
//      Create Spec
//      https://github.com/KoryNunn/JavascriptInheritance/blob/master/spec.js
//
//***********************************************

function createSpec(child, parent){
    var parentPrototype;
    
    if(!parent) {
        parent = Object;
    }
    
    if(!parent.prototype) {
        parent.prototype = {};
    }
    
    parentPrototype = parent.prototype;
    
    child.prototype = Object.create(parent.prototype);
    child.prototype.__super__ = parentPrototype;
    
    // Yes, This is 'bad'. However, it runs once per Spec creation.
    var spec = new Function("child", "return function " + child.name + "(){child.prototype.__super__.constructor.apply(this, arguments);return child.apply(this, arguments);}")(child);
    
    spec.prototype = child.prototype;
    spec.prototype.constructor = child.prototype.constructor = spec;
    
    return spec;
}


//***********************************************
//
//      IE indexOf polyfill
//
//***********************************************

//IE Specific idiocy

Array.prototype.indexOf = Array.prototype.indexOf || function(object) {
    fastEach(this, function(value, index) {
        if (value === object) {
            return index;
        }
    });
};

// http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
String.prototype.trim=String.prototype.trim||function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};

// http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
Array.isArray = Array.isArray || function(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
};

//End IE land.


//***********************************************
//
//      Array Fast Each
//
//***********************************************

function fastEach(array, callback) {
    for (var i = 0; i < array.length; i++) {
        if(callback(array[i], i, array)) break;
    }
    return array;
};


//***********************************************
//
//      String Formatter
//
//***********************************************

//http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
//changed to a single array argument
String.prototype.format = function (values) {
    return this.replace(/{(\d+)}/g, function (match, number) {
        return (values[number] == undefined || values[number] == null) ? match : values[number];
    }).replace(/{(\d+)}/g, "");
};


//***********************************************
//
//      String De-Formatter
//
//***********************************************

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


//***********************************************
//
//      Parse QueryString
//
//***********************************************

function parseQueryString(url){
    var urlParts = url.split('?'),
        result = {};

    if(urlParts.length>1){

        var queryStringData = urlParts.pop().split("&");
        
        fastEach(queryStringData, function(keyValue){
            var parts = keyValue.split("="),
                key = window.unescape(parts[0]),
                value = window.unescape(parts[1]);
                
            result[key] = value;
        });
    }

    return result;
}


//***********************************************
//
//      To QueryString
//
//***********************************************

function toQueryString(data){
    var queryString = '';

    for(var key in data){
        if(data.hasOwnProperty(key) && data[key] !== undefined){
            queryString += (queryString.length ? '&' : '?') + key + '=' + data[key];
        }
    }

    return queryString;
}


//***********************************************
//
//      Ajax
//
//***********************************************

function ajax(settings){    
    var queryStringData;
    if(typeof settings !== 'object'){
        settings = {};
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

    var request = new XMLHttpRequest();

    request.addEventListener("progress", settings.progress, false);
    request.addEventListener("load", function(event){
        if(event.target.status >= 400){
            settings.error && settings.error(event);
            return;
        }
        var data = event.target.responseText;


        if(settings.dataType === 'json'){
            if(data === ''){                
                data = undefined;
            }else{
                try{
                    data = JSON.parse(data);
                }catch(error){
                    settings.error && settings.error(event, error);
                    return;
                }
            }
        }

        settings.success && settings.success(data, event);
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
}

   
//***********************************************
//
//      Get Closest Item
//
//***********************************************

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

   
//***********************************************
//
//      Get Closest Item
//
//***********************************************

function langify(fn, context){
    return function(scope, args){
        var args = args.all();

        return fn.apply(context, args);
    }
}

   
//***********************************************
//
//      Get Distinct Groups
//
//***********************************************

function getDistinctGroups(gaffa, collection, expression){
    var distinctValues = {},
        values = gaffa.model.get('(map items ' + expression + ')', {items: collection});
    
    if(collection && typeof collection === "object"){
        if(Array.isArray(collection)){
            fastEach(values, function(value){
                distinctValues[value] = null;
            });
        }else{
            throw "Object collections are not currently supported";
        }
    }
    
    return Object.keys(distinctValues);
}

//***********************************************
//
//      De-Dom
//
//***********************************************

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

//***********************************************
//
//      Trigger Action
//
//***********************************************

function triggerAction(action, parent, scope, event) {
    action.trigger(parent, scope, event);
}

//***********************************************
//
//      Trigger Action
//
//***********************************************

function triggerActions(actions, parent, scope, event) {
    if(Array.isArray(actions)){
        fastEach(actions, function(action){
            triggerAction(action, parent, scope, event);
        });
    }
}


//***********************************************
//
//      Insert Function
//
//***********************************************

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

//***********************************************
//
//      Get ViewItem Path
//
//***********************************************

function getItemPath(item){
    var gedi = item.gaffa.gedi,
        paths = [],
        referencePath,
        referenceItem = item;    

    while(referenceItem){

        if(referenceItem.path != null){
            paths.push(referenceItem.path);
        }

        if(referenceItem.key != null){
            paths.push(gedi.paths.create(referenceItem.key));
        }

        referenceItem = referenceItem.parent;
    }
    
    return gedi.paths.resolve.apply(this, paths.reverse());
}

//***********************************************
//
//      Extend
//
//***********************************************

function extend(target, source){
    var args = Array.prototype.slice.call(arguments),
        target = args[0] || {},
        source = args[1] || {},
        visited = [];
    
    function internalExtend(target, source){
        for(var key in source){
            var sourceProperty = source[key],
                targetProperty = target[key];
                                                        
            if(typeof sourceProperty === "object" && sourceProperty != null){
                if(sourceProperty instanceof Array){
                    targetProperty = new sourceProperty.constructor();
                    fastEach(sourceProperty, function(value){
                        var item = new value.constructor();
                        internalExtend(item, value);
                        targetProperty.push(item);
                    });
                }else if(sourceProperty instanceof Date){
                    targetProperty = new Date(sourceProperty);
                }else{
                    if(visited.indexOf(sourceProperty)>=0){
                        target[key] = sourceProperty;
                        continue;
                    }
                    visited.push(sourceProperty);
                    targetProperty = targetProperty || Object.create(sourceProperty);
                    internalExtend(targetProperty, sourceProperty);
                }
            }else{
                if(targetProperty === undefined){
                    targetProperty = sourceProperty;
                }
            }
            target[key] = targetProperty;
        }
    }
    
    internalExtend(target, source);
    
    if(args[2] !== undefined && args[2] !== null){
        args[0] = args.shift();
        extend.apply(this, args);
    }
    
    return target;
}

//***********************************************
//
//      Same As
//
//***********************************************

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

//***********************************************
//
//      Add Default Style
//
//***********************************************

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

//***********************************************
//
//      Initialise ViewItem
//
//***********************************************

function initialiseViewItem(viewItem, gaffa, specCollection) {
    if(!(viewItem instanceof ViewItem)){
        if (!specCollection[viewItem.type]) {
            throw "No constructor is loaded to handle view of type " + viewItem.type;
        }            
        viewItem = new specCollection[viewItem.type](viewItem);
    }

    for(var key in viewItem.views){
        if(!(viewItem.views[key] instanceof ViewContainer)){
            viewItem.views[key] = new ViewContainer(viewItem.views[key]);
        }
        var views = viewItem.views[key];
        for (var viewIndex = 0; viewIndex < views.length; viewIndex++) {
            var view = initialiseView(views[viewIndex], gaffa);
            views[viewIndex] = view;
            view.parentContainer = views;
        }
    }
        
    for(var key in viewItem.actions){
        var actions = viewItem.actions[key];
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
            var action = initialiseAction(actions[actionIndex], gaffa);
            actions[actionIndex] = action;
            action.parentContainer = actions;
        }
    }
        
    if(viewItem.behaviours){
        for (var behaviourIndex = 0; behaviourIndex < viewItem.behaviours.length; behaviourIndex++) {
            var behaviour = initialiseBehaviour(viewItem.behaviours[behaviourIndex], gaffa);
            viewItem.behaviours[behaviourIndex] = behaviour;
            behaviour.parentContainer = viewItem.behaviours;
        }
    }
    
    return viewItem;
}
    
//***********************************************
//
//      Initialise View
//
//***********************************************

function initialiseView(viewItem, gaffa) {
    return initialiseViewItem(viewItem, gaffa, gaffa.views.constructors);
}
    
//***********************************************
//
//      Initialise Action
//
//***********************************************

function initialiseAction(viewItem, gaffa) { 
    return initialiseViewItem(viewItem, gaffa, gaffa.actions.constructors);
}

    
//***********************************************
//
//      Initialise Behaviour
//
//***********************************************

function initialiseBehaviour(viewItem, gaffa) { 
    return initialiseViewItem(viewItem, gaffa, gaffa.behaviours.constructors);
}    


//***********************************************
//
//      Remove Views
//
//***********************************************

function removeViews(views){
    if(!views){
        return;
    }

    views = views instanceof Array ? views : [views];

    views = views.slice();
    
    fastEach(views, function(viewModel){
        viewModel.remove();
    });
}

//***********************************************
//
//      JSON Converter
//
//***********************************************

function jsonConverter(object, exclude, include){
    var plainInstance = new object.constructor(),
        tempObject = Array.isArray(object) || object instanceof Array && [] || {},
        excludeProps = ["gaffa", "parent", "parentContainer", "renderedElement", "_removeHandlers", "gediCallbacks", "__super__"],
        includeProps = ["type"];
                
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

function createModelScope(parent, trackKeys, gediEvent){
    var possibleGroup = parent,
        groupKey;

    while(possibleGroup && !groupKey){
        groupKey = possibleGroup.group;
        possibleGroup = possibleGroup.parent;
    }

    return {
        __trackKeys__: trackKeys,
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
    if(!property.sameAsPrevious()){
        if(property.nextUpdate){
            cancelAnimationFrame(property.nextUpdate);
            property.nextUpdate = null;
        }
        property.nextUpdate = requestAnimationFrame(function(){
            property.update(property.parent, property.value);
        });
    }
}

function createPropertyCallback(property){
    return function (event) {
        var value,                        
            scope;

        if(event){                    
            scope = createModelScope(property.parent, property.trackKeys, event);

            
            if(event === true){ // Initial update.
                value = property.gaffa.model.get(property.binding, property, scope);

            } else if(property.binding){ // Model change update.

                if(property.ignoreTargets && event.target.toString().match(property.ignoreTargets)){
                    return;
                }
                value = event.getValue(scope);
            }

            property.keys = value && value.__gaffaKeys__;
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


//***********************************************
//
//      Bind Property
//
//***********************************************

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


//***********************************************
//
//      Gaffa object.
//
//***********************************************

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

//***********************************************
//
//      Property Object
//
//***********************************************

function Property(propertyDescription){
    if(typeof propertyDescription === 'function'){
        this.update = propertyDescription;
    }else{
        for(var key in propertyDescription){
            if(propertyDescription.hasOwnProperty(key)){
                this[key] = propertyDescription[key];
            }
        }
    }

    this.gediCallbacks = [];
}
Property = createSpec(Property);
Property.prototype.set = function(value, callUpdate){
    var gaffa = this.gaffa;

    if(callUpdate == null){
        callUpdate = true;
    }

    this.value = value;

    if(this.binding){
        this._previousHash = createValueHash(value);
        gaffa.model.set(
            this.binding,
            this.setTransform ? gaffa.model.get(this.setTransform, this, {value: value}) : value,
            this
        );
    }
    if(callUpdate && this.update){
        this.update(this.parent, value);
    }
}
Property.prototype.sameAsPrevious = function () {
    if(compareToHash(this.value, this._previousHash)){
        return true;
    }
    this._previousHash = createValueHash(this.value);
}
Property.prototype.setPreviousHash = function(hash){
    this._previousHash = hash;
};
Property.prototype.getPreviousHash = function(hash){
    return this._previousHash;
};
Property.prototype.bind = bindProperty;
Property.prototype.debind = function(){
    this.gaffa && this.gaffa.model.debind(this);
};
Property.prototype.getPath = function(){
    return getItemPath(this);
};
Property.prototype.toJSON = function(){
    var tempObject = jsonConverter(this, ['_previousHash']);
    
    return tempObject;
};

//***********************************************
//
//      View Container Object
//
//***********************************************

function ViewContainer(viewContainerDescription){
    var viewContainer = this;
    if(viewContainerDescription instanceof Array){
        for (var i = 0; i < viewContainerDescription.length; i++) {
            viewContainer.push(viewContainerDescription[i]);
        }
    }
}
ViewContainer = createSpec(ViewContainer, Array);
ViewContainer.prototype.bind = function(parent){
    this.parent = parent;
    this.gaffa = parent.gaffa;

    if(this.bound){
        return;
    }

    this.bound = true;
    
    for(var propertyKey in this){
        if(this[propertyKey] instanceof Property){
            this[propertyKey].bind(this);
        }
    }

    return this;
};
ViewContainer.prototype.debind = function(){
    if(!this.bound){
        return;
    }

    this.bound = false;

    for (var i = 0; i < this.length; i++) {
        this[i].debind();
    }
};
ViewContainer.prototype.getPath = function(){
    return getItemPath(this);
};
ViewContainer.prototype.add = function(viewModel, insertIndex){
    // If passed an array
    if(Array.isArray(viewModel)){
        for(var i = 0; i < viewModel.length; i++){
            this.add(viewModel[i]);
        }
        return this;
    }

    this.splice(insertIndex != null ? insertIndex : this.length, 0, viewModel);
    viewModel.parentContainer = this;

    if(this.bound){
        this.render.update(this, this.render.value);
    }

    return this;
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
ViewContainer.prototype.render = new Property({
    update: function(viewContainer, value){
        var i = 0,
            viewContainerLength = viewContainer.length;
        if(value){
            for(; i < viewContainerLength; i++){
                var viewModel = viewContainer[i];
                viewModel.gaffa = viewContainer.gaffa;

                if(viewModel.renderedElement){
                    continue;
                }

                if(viewModel.name){
                    viewContainer.gaffa.namedViews[viewModel.name] = viewModel;
                }


                viewModel.render();
                viewModel.bind(viewContainer.parent);
                viewModel.insert(viewContainer, i);
            }
        }else{
            for(; i < viewContainerLength; i++){
                viewContainer[i].debind();
            }
        }
    },
    value: true
});

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

    viewItem.bound = false;
}

function removeViewItem(viewItem){
    if(!viewItem.parentContainer){
        return;
    }

    var viewIndex = viewItem.parentContainer.indexOf(viewItem);

    if(viewIndex >= 0){
        viewItem.parentContainer.splice(viewIndex, 1);              
    }

    viewItem.debind();

    viewItem.parentContainer = null;
}

//***********************************************
//
//      ViewItem Object
//
//***********************************************

function ViewItem(viewItemDescription){
    
    for(var key in this){
        if(this[key] instanceof Property){
            this[key] = new this[key].constructor(this[key]);
        }
    }
    
    this.actions = {};

    for(var key in viewItemDescription){
        var prop = this[key];
        if(prop instanceof Property || prop instanceof ViewContainer){
            copyProperties(viewItemDescription[key], prop);
        }else{
            this[key] = viewItemDescription[key];
        }
    }
}
ViewItem = createSpec(ViewItem);
ViewItem.prototype.path = '[]';
ViewItem.prototype.bind = function(parent){
    var viewItem = this;

    this.parent = parent;

    this.bound = true;
    
    // Only set up properties that were on the prototype.
    // Faster and 'safer'
    for(var propertyKey in this.constructor.prototype){
        if(this[propertyKey] instanceof Property){
            var property = this[propertyKey];
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
ViewItem.prototype.toJSON = function(){
    return jsonConverter(this);
};

//***********************************************
//
//      View Object
//
//***********************************************

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

function View(viewDescription){
    var view = this;

    view._removeHandlers = [];
    view.behaviours = view.behaviours || [];        
}
View = createSpec(View, ViewItem);

View.prototype.bind = function(parent){
    ViewItem.prototype.bind.apply(this, arguments);

    for(var i = 0; i < this.behaviours.length; i++){
        this.behaviours[i].gaffa = this.gaffa;
        this.behaviours[i].bind(this);
    }

    for(var key in this.actions){
        var actions = this.actions[key],
            off;

        if(actions._bound){
            continue;
        }
        
        actions._bound = true;

        off = bindViewEvent(this, key);

        if(off){
            this._removeHandlers.push(off);
        }
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
    while(this._removeHandlers.length){
        this._removeHandlers.pop()();
    }
    debindViewItem(this);
};

View.prototype.render = function(){
    this.renderedElement.viewModel = this;
};

View.prototype.insert = function(viewContainer, insertIndex){
    var view = this,
        gaffa = view.gaffa;

    if(view.afterInsert){
        doc.on('DOMNodeInserted', document, function (event) {
            if(doc.closest(view.renderedElement, event.target)){
                view.afterInsert();
            }
        });
    }

    var renderTarget = this.renderTarget || viewContainer && viewContainer.element || gaffa.views.renderTarget || 'body';
    this.insertFunction(this.insertSelector || renderTarget, this.renderedElement, insertIndex);

};

function Classes(){};
Classes = createSpec(Classes, Property);
Classes.prototype.update = function(view, value){
    if(!('internalClassNames' in view.classes)){
        view.classes.internalClassNames = view.renderedElement.className;
    }

    var internalClassNames = view.classes.internalClassNames,
        classes = [internalClassNames, value].join(' ').trim();
    
    view.renderedElement.className = classes ? classes : null;
};
View.prototype.classes = new Classes();

function Visible(){};
Visible = createSpec(Visible, Property);
Visible.prototype.value = true;
Visible.prototype.update = function(view, value) {
    view.renderedElement.style.display = value ? null : 'none';
};
View.prototype.visible = new Visible();

function Enabled(){};
Enabled = createSpec(Enabled, Property);
Enabled.prototype.value = true;
Enabled.prototype.update = function(view, value) {
    if(!value === !!view.renderedElement.disabled){
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

function RenderChildren(){};
RenderChildren = createSpec(RenderChildren, Property);
RenderChildren.prototype.update = function(view, value) {
    if('value' in this){
        for(var key in view.views){
            view.views[key].render.value = value;
        }
    }
};
View.prototype.renderChildren = new RenderChildren();

View.prototype.insertFunction = insertFunction;


//***********************************************
//
//      Container View Object
//
//***********************************************

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
ContainerView.prototype.remove = function(){
    View.prototype.remove.apply(this, arguments);
    for(var key in this.views){
        var viewContainer = this.views[key];
        
        if(viewContainer instanceof ViewContainer){
            viewContainer.empty();
        }
    }
};


//***********************************************
//
//      Action Object
//
//***********************************************

function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.prototype.bind = function(){
    ViewItem.prototype.bind.call(this);
};
Action.prototype.trigger = function(parent, scope, event){
    this.parent = parent;

    scope = scope || {};

    var gaffa = this.gaffa = parent.gaffa,
        outerTrackKeys = scope.__trackKeys__;


    for(var propertyKey in this.constructor.prototype){
        var property = this[propertyKey];

        if(property instanceof Property && property.binding){
            property.gaffa = gaffa;
            property.parent = this;
            scope.__trackKeys__ = property.trackKeys;
            property.value = gaffa.model.get(property.binding, this, scope);
        }
    }

    scope.__trackKeys__ = outerTrackKeys;

    this.debind();
};

//***********************************************
//
//      Behaviour Object
//
//***********************************************

function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);
Behaviour.prototype.toJSON = function(){
    return jsonConverter(this);
};


function Gaffa(){


    var gedi,
        // Create gaffa global.
        gaffa = {};

        
    // Dom accessible instance
    window.addEventListener('DOMContentLoaded', function(){
        document.body.gaffa = gaffa;
    });
    
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
    
    // Gedi.Gel extensions
    
    function getSourceKeys(array){            
        return array.__gaffaKeys__ || (function(){
            var arr = [];
            while(arr.length < array.length && arr.push(arr.length.toString()));
            return arr;
        })();
    }

    var originalFilter = gedi.gel.scope.filter;
    gedi.gel.scope.filter = function(scope, args) {
        if(!scope.get('__trackKeys__')){
            return originalFilter(scope, args);
        }
        var args = args.all(),
            sourceArrayKeys,
            filteredList = [];
        
        var array = args[0];
        var functionToCompare = args[1];

        if(!array){
            return undefined;
        }
            
        sourceArrayKeys = getSourceKeys(array);

        filteredList.__gaffaKeys__ = [];
            
        if (args.length < 2) {
            return args;
        }
        
        if (Array.isArray(array)) {
            
            fastEach(array, function(item, index){
                if(typeof functionToCompare === "function"){
                    if(scope.callWith(functionToCompare, [item])){ 
                        filteredList.push(item);
                        filteredList.__gaffaKeys__.push(sourceArrayKeys[index]);
                    }
                }else{
                    if(item === functionToCompare){ 
                        filteredList.push(item);
                        filteredList.__gaffaKeys__.push(sourceArrayKeys[index]);
                    }
                }
            });
            return filteredList;
        
        }else {
            return;
        }
    };
    
    var originalSlice = gedi.gel.scope.slice;
    gedi.gel.scope.slice = function(scope, args) {
        if(!scope.get('__trackKeys__')){
            return originalSlice(scope, args);
        }
        var target = args.next(),
            start,
            end,
            result,
            sourceArrayKeys;

        if(args.hasNext()){
            start = target;
            target = args.next();
        }
        if(args.hasNext()){
            end = target;
            target = args.next();
        }

        if(!Array.isArray(target)){
            return;
        }

        sourceArrayKeys = getSourceKeys(target);

        result = target.slice(start, end);

        result.__gaffaKeys__ = sourceArrayKeys.slice(start, end);
        
        return result;
    };

    // This is pretty dirty..
    function ksort(array, scope, sortFunction){

        if(array.length < 2){
            return array;
        }

        var sourceArrayKeys = getSourceKeys(array),
            source = array.slice(),
            sourceKeys = sourceArrayKeys.slice(),
            left = [],
            pivot = source.splice(source.length/2,1).pop(),
            pivotKey = sourceKeys.splice(sourceKeys.length/2,1).pop(),
            right = [],
            result,
            resultKeys;

        left.__gaffaKeys__ = [];
        right.__gaffaKeys__ = [];

        for(var i = 0; i < source.length; i++){
            var item = source[i];
            if(scope.callWith(sortFunction, [item, pivot]) > 0){           
                right.push(item);
                right.__gaffaKeys__.push(sourceKeys[i]);
            }else{
                left.push(item);
                left.__gaffaKeys__.push(sourceKeys[i]);
            }
        }

        left = ksort(left, scope, sortFunction);

        left.push(pivot);
        left.__gaffaKeys__.push(pivotKey);

        right = ksort(right, scope, sortFunction);

        resultKeys = left.__gaffaKeys__.concat(right.__gaffaKeys__);

        result = left.concat(right);
        result.__gaffaKeys__ = resultKeys;

        return result;
    }
    
    var originalSort = gedi.gel.scope.sort;
    gedi.gel.scope.sort = function(scope, args) {
        if(!scope.get('__trackKeys__')){
            return originalSort(scope, args);
        }

        var target = args.next(),
            sortFunction = args.next(),
            result,
            sourceArrayKeys,
            sortValues = [];

        if(!Array.isArray(target)){
            return;
        }

        result = ksort(target, scope, sortFunction);
        
        return result;
    };

    
    //***********************************************
    //
    //      add Behaviour
    //
    //*********************************************** 
    
    function addBehaviour(behaviour) {
        //if the views isnt an array, make it one.
        if (Array.isArray(behaviour)) {
            fastEach(behaviour, addBehaviour);
            return;
        }

        behaviour.gaffa = gaffa;
        behaviour.parentContainer = internalBehaviours;
        
        behaviour.bind();
        
        internalBehaviours.push(behaviour);
    }

    
    //***********************************************
    //
    //      Add Notification
    //
    //***********************************************
    
    function addNotification(kind, callback){
        internalNotifications[kind] = internalNotifications[kind] || [];
        internalNotifications[kind].push(callback);
    }

    
    //***********************************************
    //
    //      Notify
    //
    //***********************************************
    
    function notify(kind, data){
        var subKinds = kind.split(".");
            
        fastEach(subKinds, function(subKind, index){
            var notificationKind = subKinds.slice(0, index + 1).join(".");
            
            internalNotifications[notificationKind] && fastEach(internalNotifications[notificationKind], function(callback){
                callback(data);
            });
        });
    }


    //***********************************************
    //
    //      QueryString To Model
    //
    //***********************************************
    
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

    //***********************************************
    //
    //      Load
    //
    //***********************************************
    
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
            fastEach(app.views, function(view, index){
                app.views[index] = initialiseView(view, gaffa);
            });
            targetView.add(app.views);
        }
        if (app.behaviours) {
            fastEach(app.behaviours, function(behaviour, index){
                app.behaviours[index] = initialiseBehaviour(behaviour, gaffa);
            });
            gaffa.behaviours.add(app.behaviours);
        }
        
        queryStringToModel();
    }

    //***********************************************
    //
    //      Navigate
    //
    //***********************************************

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
            
            load(data, target);
            
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
    
    //***********************************************
    //
    //      Pop State
    //
    //***********************************************

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

    extend(gaffa, {
        addDefaultStyle: addDefaultStyle,
        createSpec: createSpec,
        jsonConverter: jsonConverter,
        Path: gedi.Path,
        ViewItem: ViewItem,
        View: View,
        ContainerView: ContainerView,
        Action: Action,
        Behaviour: Behaviour,
        Property: Property,
        ViewContainer: ViewContainer,
        initialiseViewItem: initialiseViewItem,
        events:{
            on: function(eventName, target, callback){
                if('on' + eventName.toLowerCase() in target){
                    return doc.on(eventName, target, callback);
                }
            }
        },
        model: {
            get:function(path, parent, scope) {
                if(!(parent instanceof ViewItem || parent instanceof Property)){
                    scope = parent;
                    parent = undefined;
                }

                var parentPath;
                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }
        
                scope = scope || {};

                addDefaultsToScope(scope);
                
                return gedi.get(path, parentPath, scope);
            },
            set:function(path, value, parent, dirty) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }
                
                gedi.set(path, value, parentPath, dirty);
            },
            remove: function(path, parent, dirty) {
                var parentPath;

                if(path == null){
                    return;
                }
                
                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }
                
                gedi.remove(path, parentPath, dirty);
            },
            bind: function(path, callback, parent) {
                var parentPath;

                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }

                if(!parent.gediCallbacks){
                    parent.gediCallbacks = [];
                }
                
                // Add the callback to the list of handlers associated with the viewItem
                parent.gediCallbacks.push(function(){
                    gedi.debind(callback);
                });
                
                gedi.bind(path, callback, parentPath);
            },
            debind: function(item) {
                while(item.gediCallbacks && item.gediCallbacks.length){
                    item.gediCallbacks.pop()();
                }
            },
            isDirty: function(path, parent) {
                var parentPath;

                if(path == null){
                    return;
                }
                
                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }
                
                return gedi.isDirty(path, parentPath);
            },
            setDirtyState: function(path, value, parent) {
                var parentPath;

                if(path == null){
                    return;
                }

                if(parent && parent.getPath){
                    parentPath = parent.getPath();
                }
                
                gedi.setDirtyState(path, value, parentPath);
            }
        },
        views: {
            insertTarget: null,
            
            //Add a view or viewModels to another view, or the root list of viewModels if a parent isnt passed.
            //Set up the viewModels bindings as they are added.
            add: function(view, insertIndex){
                if(Array.isArray(view)){
                    fastEach(view, gaffa.views.add);
                    return;
                }

                if(view.name){
                    gaffa.namedViews[view.name] = viewItem;
                }

                view.gaffa = gaffa;
                view.parentContainer = internalViewItems;
                view.render();
                view.bind();
                view.insert(internalViewItems, insertIndex);
            },
            
            remove: removeViews,

            empty: function(){
                removeViews(internalViewItems);
            },

            constructors: {}
        },

        namedViews: {},

        actions: {
            trigger: triggerActions,

            constructors: {}
        },

        behaviours: {
            add: addBehaviour,

            constructors: {}
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

        navigate: navigate,
        
        notifications:{  
            add: addNotification,
            notify: notify
        },
        
        load: function(app, pushPageState){
                    
            var title;
                    
            if(app !== undefined && app !== null && app.title){
                title = app.title;
            }

            if(pushPageState){
                // ToDo: Push state no worksies in exploder.
                gaffa.pushState(app, title, document.location);
            }
            load(app);
        },
        
        //If you want to load the values in query strings into the pages model.
        queryStringToModel: queryStringToModel,
        
        //This is here so i can remove it later and replace with a better verson.
        extend: extend,
        
        clone: function(value){
            if(value != null && typeof value === "object"){
                if(Array.isArray(value)){
                    return value.slice();
                }else if (value instanceof Date) {
                    return new Date(value);
                }else{
                    return extend({}, value);
                }
            }
            return value;
        },
        ajax: ajax,
        crel: crel,
        doc: doc,
        fastEach: fastEach,
        getClosestItem: getClosestItem,
        pushState: function(state, title, location){
            window.history.pushState(state, title, location);
        }
    });

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
    collection: function (viewsName, insert, remove, empty) {
        return function (viewModel, value) {
            var property = this,
                valueLength = 0,
                childViews = viewModel.views[viewsName],
                valueKeys = property.keys,
                calculateValueLength = function(){
                    if(Array.isArray(value)){
                        return value.length;
                    }else if(typeof value === "object"){
                        return Object.keys(value).length;
                    }
                };
                
            if (value && typeof value === "object"){

                var element = viewModel.renderedElement;
                if (element && property.template) {
                    var newView,
                        isEmpty = true;
                    
                    //Remove any child nodes who no longer exist in the data
                    for(var i = 0; i < childViews.length; i++){
                        var childView = childViews[i],
                            existingKey = childView.key;
                            
                        if(
                            (
                                (valueKeys && !(valueKeys.indexOf(existingKey)>=0)) ||
                                !value[childView.key]
                            ) &&
                            childView.containerName === viewsName
                        ){
                            i--;
                            remove(viewModel, value, childView);
                            childView.remove();
                        }
                    }

                    var itemIndex = 0;
                    
                    //Add items which do not exist in the dom
                    for (var key in value) {
                        if(Array.isArray(value) && isNaN(key)){
                            continue;
                        }
                        
                        isEmpty = false;
                        
                        var existingChildView = false;
                        for(var i = 0; i < childViews.length; i++){
                            var child = childViews[i],
                                valueKey = key;
                                
                            if(valueKeys){
                                valueKey = valueKeys[key];
                            }
                                
                            if(child.key === valueKey){
                                existingChildView = child;
                            }
                        }
                        
                        if (!existingChildView) {
                            var newViewKey = key;
                            if(valueKeys){
                                newViewKey = valueKeys[key];
                            }
                            newView = {key: newViewKey, containerName: viewsName};
                            insert(viewModel, value, newView, itemIndex);
                        }

                        itemIndex++;
                    }
                    
                    empty(viewModel, isEmpty);
                }
            }else{
                for(var i = 0; i < childViews.length; i++){
                    var childView = childViews[i];
                    if(childView.containerName === viewsName){
                        i--;
                        remove(viewModel, value, childView); 
                        childView.remove();                           
                    }
                }
                empty(viewModel, true);
            }
        };
    },
    
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
                    fastEach(previousGroups, function(group, index){
                        if(group !== viewModel.distinctGroups[group]){
                            same = false;
                        }
                    });
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
                
                fastEach(viewModel.distinctGroups, function(group){
                    var exists = false;
                    fastEach(childViews, function(child){
                        if(child.group === group){
                            exists = true;
                        }
                    });
                    
                    if (!exists) {
                        newView = {group: group};
                        insert(viewModel, value, newView);
                    }
                });
                                            
                isEmpty = !childViews.length;
                                            
                empty(viewModel, isEmpty);
            }else{
                fastEach(childViews, function(childView, index){
                    childViews.splice(index, 1);
                    remove(viewModel, property.value, childView);
                });
            }
        };
    }
};

module.exports = Gaffa;
