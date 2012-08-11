//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (undefined) {
    "use strict";

    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa();

    //"constants"
    // functions to make it 'getter only'
    gaffa.pathSeparator = "/";
    gaffa.upALevel =  "..";
    gaffa.relativePath = "~";
    gaffa.pathStart = "[";
    gaffa.pathEnd = "]";

    //internal varaibles
    var internalModel = {},
    //these must always be instantiated.
        internalViewModels = [],

        internalBindings = [],
        
        internalActions = {},

        memoisedModel = {};
        

    //internal functions

    //***********************************************
    //
    //      IE indexOf polyfill
    //
    //***********************************************

    //IE Specific idiocy

    Array.prototype.indexOf = Array.prototype.indexOf || function(object) {
        this.fastEach(function(value, index) {
            if (value === object) {
                return index;
            }
        });
    };

    //End IE land.


    /*
    Now I can detect arrays.
    */
    Array.prototype.isArray = true;

    /* maybe switch to this if needed, however i havent had the requirement yet, and mine is faster
    http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    */

    //***********************************************
    //
    //      Array Fast Each
    //
    //***********************************************

    Array.prototype.fastEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            if(callback(this[i], i, this)) break;
        }
        return this;
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
    //      QueryString To Model
    //
    //***********************************************
    
    function queryStringToModel(){
        var queryStringData = window.location.search.slice(1).split("&");
        
        queryStringData.fastEach(function(keyValue){
            var parts = keyValue.split("="),
                key = window.unescape(parts[0]),
                value = window.unescape(parts[1]);
                
            if(key){
                if(value){
                    gaffa.model.set(rawToPath(key), value);
                }else{
                    gaffa.model.set(rawToPath(key), null);
                }
            }
        });
    }

    //***********************************************
    //
    //      Navigate
    //
    //***********************************************

    function navigate(url, model, post) {
        $.ajax({
            url: url,
            type: (post && "post") || "get",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                var title;
                        
                if(data !== undefined && data !== null && data.title){
                    title = data.title;
                }
                
                // ToDo: Push state no worksies in exploder.
                window.history.pushState(data, title, url);
                
                load(data, model);
                
                window.scrollTo(0,0);
            }
        });
    }
    
    //***********************************************
    //
    //      Load
    //
    //***********************************************
    
    function load(app, model){
    
        memoisedModel = {};
        internalBindings = [];

        if (app.views) {
            gaffa.views.set(app.views);
        }
        if (app.model) {
            internalModel = {},
            gaffa.model.set(app.model);
        }
        if (app.behaviours) {
            gaffa.behaviours.add(app.behaviours);
        }
        if (app.model && model) {
            var newModel = extend({}, app.model, model);
            gaffa.model.set(newModel);
        }
        
        queryStringToModel();
    }
    
    // ToDo: Pop state no worksies in exploder.
    window.onpopstate = function(event){
        if(event.state){
            load(event.state);
        }
    };

    //***********************************************
    //
    //      Get Distinct Groups
    //
    //***********************************************
    
    function getDistinctGroups(collection, property){
        var distinctValues = [];
        
        if(collection && typeof collection === "object"){
            if(collection.isArray){
                collection.fastEach(function(value){
                    var candidate = gaffa.utils.getProp(value, property);
                    if(distinctValues.indexOf(candidate)<0){
                        distinctValues.push(candidate);
                    }
                });
            }else{
                for(var key in collection){
                    var candidate = gaffa.utils.getProp(collection[key], property);
                    if(distinctValues.indexOf(candidate)<0){
                        distinctValues.push(candidate);
                    }
                }
            }
        }
        
        return distinctValues;
    }

    //***********************************************
    //
    //      Get
    //
    //***********************************************
    
    
    // Lots of similarities between get and set, refactor later to reuse code.
    function get(path, model) {
        if (path) {
            //This returns the same memoisedModel given different keys
            //ToDo: figure out why
            // if (memoisedModel[model] && memoisedModel[model][path]) {
            //         return memoisedModel[model][path];
            // }
                        
            var keys = gaffa.paths.stripUpALevels(pathToRaw(path)).split(gaffa.pathSeparator),
                reference = model;

            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                /*
                if the thing at the current key in the model is an object
                or an array (both typeof to object),
                set it as the thing we want to look into next.
                */
                if (reference === null || reference === undefined) {
                    break;
                } else if (typeof reference[keys[keyIndex]] === "object") {
                    reference = reference[keys[keyIndex]];

                    /*
                    else if there isn't anything at this key, exit the loop,
                    and return undefined.
                    */
                }
                else if (reference[keys[keyIndex]] === undefined) {
                    reference = undefined;
                    break;

                    /*
                    otherwise, we're at the end of the line. return whatever's
                    there
                    */
                }
                else {
                    reference = reference[keys[keyIndex]];
                    break;
                }
            }
            
            memoisedModel[model] = memoisedModel[model] || {};
            memoisedModel[model][path] = reference;
            return reference;
        }
        return model;
    }
    

    //***********************************************
    //
    //      Set
    //
    //***********************************************

    function set(path, value, model) {
    
        //passed a null or undefined path, do nothing.
        if(!path){
            return;
        }
        
        // do reverse expressions when antmt isnt lazy.

        //If you just pass in an object, you are overwriting the model.
        if (typeof path === "object") {
            for (var modelProp in model) {
                delete model[modelProp];
                gaffa.model.trigger(modelProp);
            }
            for (var pathProp in path) {
                model[pathProp] = path[pathProp];
                gaffa.model.trigger(pathProp, model[pathProp]);
            }
            return;
        }
        
        var keys = gaffa.paths.stripUpALevels(pathToRaw(path)).split(gaffa.pathSeparator),
            reference = model,
            triggerStack = [];

        keys.fastEach(function (key, index, keys) {

            var rawPath;
            
            //if we have hit a non-object property on the reference and we have more keys after this one
            //make an object (or array) here and move on.
            if ((typeof reference[key] !== "object" || reference[key] === null) && index < keys.length - 1) {
                if (!isNaN(key)) {
                    reference[key] = [];
                }
                else {
                    reference[key] = {};
                }
            }
            if (index === keys.length - 1) {
                // if we are at the end of the line, set to the model
                reference[key] = value;

                //Report to parent arrays
                if (!isNaN(reference.length)) {
                    triggerStack.push(keys.slice(0, keys.length - 2).join(gaffa.pathSeparator));
                }

                //Report to things looking for all changes below here.
                rawPath = keys.join("_");
                triggerStack.push(rawPath);
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];

                //Report to things looking for all changes below here.
                rawPath = keys.slice(0, index + 1).join("_");
                triggerStack.push(rawPath);
            }
        });

        memoisedModel[model] = {};

        //IMA FIREIN MA CHANGEZOR!.
        var finalRawPath = keys.join(gaffa.pathSeparator);
        gaffa.model.trigger(finalRawPath);

        triggerStack.reverse().fastEach(function (rawPath) {
            gaffa.model.trigger(rawPath);
        });
    }

    //***********************************************
    //
    //      Remove
    //
    //***********************************************

    function remove(path, model) {

        //passed an array binding, take the first as default.
        //this would happen if an array was used as a binding without a format string
        
        

        var keys = gaffa.paths.stripUpALevels(pathToRaw(path)).split(gaffa.pathSeparator),
            reference = model,
            triggerStack = [];

        //handle "Up A Level"s in the path.
        //yeah yeah, its done differently up above...
        //ToDo: refactor.

        keys.fastEach(function (key, index, keys) {

            var rawPath;

            //if we have hit a non-object and we have more keys after this one,
            //return
            if (typeof reference[key] !== "object" && index < keys.length - 1) {
                return;
            }
            if (index === keys.length - 1) {
                // if we are at the end of the line, delete the last key
                
                if (!isNaN(reference.length)) {
                    reference.splice(key, 1);
                }else{
                    delete reference[key];
                }
                
                //Report to parent arrays
                triggerStack.push(keys.slice(0, keys.length - 2).join(gaffa.pathSeparator));

                //Report to things looking for all changes below here.
                rawPath = keys.join("_");
                triggerStack.push(rawPath);
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];

                //Report to things looking for all changes below here.
                rawPath = keys.slice(0, index + 1).join("_");
                triggerStack.push(rawPath);
            }
        });

        memoisedModel[model] = {};

        //IMA FIREIN MA CHANGEZOR!.
        triggerStack.reverse().fastEach(function (rawPath) {
            gaffa.model.trigger(rawPath);
        });
    }

    //***********************************************
    //
    //      Trigger Binding
    //
    //***********************************************

    function triggerBinding(rawPath) {
        var keys = gaffa.paths.stripUpALevels(rawPath).split(gaffa.pathSeparator),
            reference = internalBindings;


        keys.fastEach(function (key) {

            if (!isNaN(key) || [].hasOwnProperty(key)) {
                key = "_" + key;
            }

            if (reference !== undefined && reference !== null) {
                reference = reference[key];
            }
        });

        if (reference != undefined && reference !== null) {
            reference.fastEach(function (callback) {
                callback();
            });

            for (var key in reference) {
                if (reference.hasOwnProperty(key) && reference[key].isArray) {
                
                    //un-excape underscored array properties.
                    if (key.indexOf("_") === 0 && (!isNaN(key.substr(1))||[].hasOwnProperty(key.substr(1)))) {
                        key = key.substr(1);
                    }
                    triggerBinding(keys.join(gaffa.pathSeparator) + gaffa.pathSeparator + key);
                }
            }
        }
    }

    //***********************************************
    //
    //      Set Binding
    //
    //***********************************************

    function setBinding(path, callback) {
    
        //If the binding has opperators in it, break them apart and set them individually.
                
        var bindingParts = getPathsInExpression(path);
        if (bindingParts.length > 1) {
            bindingParts.fastEach(function (value) {
                setBinding(value, callback);
            });
            return;
        }

        var keys = gaffa.paths.stripUpALevels(pathToRaw(path)).split(gaffa.pathSeparator),
            reference = internalBindings;

        keys.fastEach(function (key, index, keys) {
            
            //escape properties of the array with an underscore.
            // numbers mean a binding has been set on an array index.
            // array property bindings like length can also be set, and thats why all array properties are escaped.
            if (!isNaN(key) || [].hasOwnProperty(key)) {
                key = "_" + key;
            }

            //if we have more keys after this one
            //make an array here and move on.
            if (typeof reference[key] !== "object" && index < keys.length - 1) {
                reference[key] = [];
                reference = reference[key];
            }
            else if (index === keys.length - 1) {
                // if we are at the end of the line, add the callback
                reference[key] = reference[key] || [];
                reference[key].push(callback);
            }
            //otherwise, RECURSANIZE! (ish...)
            else {
                reference = reference[key];
            }
        });
    }

    //***********************************************
    //
    //      Render View
    //
    //***********************************************

    function renderView(viewModel, renderTarget, appendFunction, index) {
        //un-comment to delegate rendering to happen as soon as possible, but not if it blocks the UI.
        //this will cause all kinds of hilariously stupid layout if you breakpoint during the render loop.
        //setTimeout(function () {
        
        //Easy text/html views
        if (viewModel.type === undefined && viewModel.html !== undefined) {
            viewModel.type = "html";
            viewModel.properties = {
                html: { value: viewModel.html }
            };
        }
        
        if (viewModel.type === undefined && viewModel.text !== undefined) {
            viewModel.type = "text";
            viewModel.properties = {
                text: { value: viewModel.text }
            };
        }

        //Check if a renderer for the view type is loaded.
        if (gaffa.views[viewModel.type] !== undefined) {
            //it is, so render it.
            gaffa.views[viewModel.type].render(viewModel);
            
            // if a renderTarget has been passed (for appending into)
            // Only append if it hasnt been rendered already
            // ToDo: make this bettera maybe.
            if(!viewModel.isRendered){
                viewModel.isRendered = true;
                if (viewModel.insertSelector && typeof viewModel.insertFunction === "function"){
                    viewModel.insertFunction(viewModel.insertSelector, viewModel.renderedElement);
                }else if (renderTarget) {
                    //A custom append function can also be passed to handle non-html elements like SVG etc.
                    if (appendFunction) {
                        appendFunction(renderTarget, viewModel.renderedElement, index);
                    } else {
                        var children = renderTarget.childNodes;
                        if(index != null && children.length > index){
                            renderTarget.insertBefore(viewModel.renderedElement, children[index]);
                        }else{
                            renderTarget.appendChild(viewModel.renderedElement);
                        }
                    }
                }
                
                //Render child views
                for (var key in viewModel.views) {
                    viewModel.views[key].fastEach(function (childViewModel) {
                        renderView(childViewModel, viewModel.viewContainers[key].element);
                    });
                }

                //Bind the views actions
                //ToDo: this probaly shouldn't be here. refactor.
                if (viewModel.actions) {
                    for (var actionKey in viewModel.actions) {
                        var action = viewModel.actions[actionKey];
                        if (!action.bound) {
                            $(viewModel.renderedElement).bind(actionKey, function () {
                                gaffa.actions.trigger(action, viewModel);
                            });
                            action.bound = true;
                        }
                    }
                }
            }
        }
        //}, 0);
    }

    //***********************************************
    //
    //      Trigger Action
    //
    //***********************************************

    //mostly just make sure all the relative bindings are made absolute. delegate actions to the appropriate action object.
    //ToDo: make actions more like views so bindings work better.
    function triggerAction(action, parent) {
        //bind each of the action properties to the model.
        var absoluteActionPath = getAbsolutePath(getViewItemPath(parent), action.path);
        
        for (var propertyName in action.properties) {
            var property = action.properties[propertyName];
            if (property && property.binding) {
                property.value = gaffa.model.get(property.binding, absoluteActionPath);
            }
        }
        if (typeof gaffa.actions[action.type] === "function") {
            action.parent = parent;
            gaffa.actions[action.type](action);
        }
    }

    //***********************************************
    //
    //      Bind Property
    //
    //***********************************************

    function bindProperty(viewModel, path, propertyName, absoluteViewPath) {
        gaffa.model.bind(path, function () {
            if(typeof gaffa.views[viewModel.type].update[propertyName] === "function"){
                viewModel.properties[propertyName].value = gaffa.model.get(viewModel.properties[propertyName].binding, absoluteViewPath);
                gaffa.views[viewModel.type].update[propertyName](viewModel);
            }
        });
    }

    //***********************************************
    //
    //      Bind Properties
    //
    //***********************************************

    //ToDo: genericise this so it can be used for action properties when they get implemented.
    function bindProperties(viewModel) {

        //bind each of the views properties to the model.
        for (var propertyName in viewModel.properties) {
            var property = viewModel.properties[propertyName];
            if (property && property.binding) {
                var paths = getPathsInExpression(property.binding),
                    absoluteViewPath = getViewItemPath(viewModel);
                paths.fastEach(function(path){
                    path = getAbsolutePath(absoluteViewPath, path);

                    // this function is to create a closure so that 'propertyName' is still the same when the event fires.
                    (function (propertyName, property, path, absoluteViewPath) {
                        if (path) {
                            property.value = gaffa.model.get(property.binding, absoluteViewPath);
                            bindProperty(viewModel, path, propertyName, absoluteViewPath);
                        }
                    })(propertyName, property, path, absoluteViewPath);
                });
            }
        }
    }

    //***********************************************
    //
    //      Bind View
    //
    //***********************************************

    //gaffa together view properties to model properties.
    function bindView(viewModel) {

        // Check if a view is loaded to handle the passed in view.
        if (viewModel && viewModel.type) {
            if (gaffa.views[viewModel.type] === undefined) {
                console.error("No view loaded to handle views of type: " + viewModel.type + ", Are you missing a script reference?");
                return;
            }
            

            //ToDo: probs a better way to do this....
            //Extend the passed in settings with defaults
             extend(viewModel, gaffa.views[viewModel.type].defaults);


            //recursivly bind child views.
            for (var viewKey in viewModel.views) {
                viewModel.views[viewKey].fastEach(function (childViewModel) {
                    childViewModel.parent = viewModel;
                    bindView(childViewModel);
                });
            }
                    
            bindProperties(viewModel, viewModel.path);
        
        } else if(viewModel.text === undefined) {
            console.error("Invalid viewModel. Object contains no 'type' property");
            return;
        }
    }
    

    //***********************************************
    //
    //      Insert View
    //
    //***********************************************
    
    function insertView(selector, renderedElement){
        $(selector).append(renderedElement);
    }

    
    //***********************************************
    //
    //      Get Paths
    //
    //***********************************************
              
    function getPathsInExpression(exp){
        var paths = [];
        if(gel){
            var tokens = gel.getTokens(exp, 'path');
            tokens.fastEach(function(token){
                paths.push(token.value);
            });
        }else{
            return [exp];
        }
        return paths;
    }
    
    //***********************************************
    //
    //      Get Path
    //
    //***********************************************

    function getViewItemPath(viewModel){
        var resolvedPath = viewModel.path,
            parentPath = "",
            args = Array.prototype.slice.call(arguments);
        
        if(viewModel.parent){
            parentPath = getViewItemPath(viewModel.parent);
        }
        
        var absoluteArgs = [parentPath, resolvedPath];
        viewModel.key && absoluteArgs.push(rawToPath(gaffa.relativePath + viewModel.key));
        absoluteArgs = absoluteArgs.concat(args.slice(1));
        
        return getAbsolutePath.apply(this, absoluteArgs);
    }
    
    //***********************************************
    //
    //      Path to Raw
    //
    //***********************************************
    
    function pathToRaw(path){
        return path && path.slice(1,-1);
    }
    
    //***********************************************
    //
    //      Raw To Path
    //
    //***********************************************
    
    function rawToPath(rawPath){
        return gaffa.pathStart + rawPath + gaffa.pathEnd;
    }
    
    //***********************************************
    //
    //      Get Absolute Path
    //
    //***********************************************
    
    function getAbsolutePath(){
        var args = Array.prototype.slice.call(arguments),
            parentPath = pathToRaw(args[0]),
            childPath = pathToRaw(args[1]),
            absolutePath = "";
            
        if(!childPath || childPath === gaffa.relativePath){
            absolutePath = parentPath;
        } else if(childPath.indexOf(gaffa.relativePath) === 0){
            absolutePath = gaffa.paths.stripUpALevels(parentPath + (parentPath && gaffa.pathSeparator) + childPath.slice(1));
        } else {
            absolutePath = gaffa.paths.stripUpALevels(childPath);
        }
        
        absolutePath = rawToPath(absolutePath);
        
        if(args[2] !== undefined && args[2] !== null){
            args.shift();
            args[0] = absolutePath;
            absolutePath = getAbsolutePath.apply(this, args);
        }
        
        return absolutePath;
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
                                                            
                if(typeof sourceProperty === "object"){
                    if(Array.isArray(sourceProperty)){
                        targetProperty = [];
                        sourceProperty.fastEach(function(value){
                            targetProperty.push(internalExtend({}, value));
                        });
                    }else{
                        if(visited.indexOf(sourceProperty)>=0){
                            target[key] = sourceProperty;
                            continue;
                        }
                        visited.push(sourceProperty);
                        targetProperty = targetProperty || {};
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

    //Public Objects ******************************************************************************
    
    function path(path){
        this.path = path;
    }
    
    function View(){
        
    }

    //***********************************************
    //
    //      Gaffa object.
    //
    //***********************************************

    //Creates the public gaffa object
    //ToDo: remove anonymous functions from here, make it just references to named functions.
    function newGaffa() {

        function innerGaffa() { }

        innerGaffa.prototype = {
            path: path,
            paths: {
                getViewItemPath: getViewItemPath,
                getAbsolutePath: getAbsolutePath,
                stripUpALevels: function (path) {
                    var keys = path.split(gaffa.pathSeparator);
                    for (var index = 0; index < keys.length; index++) {
                        var key = keys[index];
                        if (key === gaffa.upALevel) {
                            keys.splice(Math.max(index - 1, 0), 2);
                            index -= 2;
                        }
                    }
                    return (keys.join(gaffa.pathSeparator));
                }
            },
            model: {
                get: function (path, parentPath, noGel) {
                    if(path && !noGel && gel){
                    
                    
                        gel.tokenConverters.others.path = function(expression) {
                            if (expression[0] === '[') {
                                var index = 1,
                                    escapes = 0;
                                do {
                                    if (expression[index] === '\\' && (expression[index + 1] === '[' || expression[index + 1] === ']')) {
                                        expression = expression.slice(0, index) + expression.slice(index + 1);
                                        index++;
                                        escapes++;
                                    }
                                    else {
                                        index++;
                                    }
                                } while (expression[index] !== ']' && index < expression.length);
                    
                                if (index > 1) {
                                    return {
                                        value: expression.slice(0, index + 1),
                                        index: index + escapes + 1,
                                        callback: function() {
                                            return gaffa.model.get(expression.slice(0, index + 1), parentPath, true);
                                        }
                                    };
                                }
                            }
                        };
                        
                        return gel.parse(path);
                    }
                    if(parentPath){
                        path = getAbsolutePath(parentPath, path);
                    }
                    return get(path, internalModel);
                },

                set: function (path, value, viewItem) {
                    if(viewItem){
                        path = getAbsolutePath(getViewItemPath(viewItem), path);
                    }
                    set(path, value, internalModel);
                },
                
                remove: function (path, viewItem) {
                    if(viewItem){
                        path = getAbsolutePath(getViewItemPath(viewItem), path);
                    }
                    remove(path, internalModel);
                },

                bind: function (binding, callback) {
                    setBinding(binding, callback);
                },

                trigger: function (binding, value) {
                    triggerBinding(binding, value);
                }
            },
            views: {
                renderTarget: null,

                render: function (viewModels, parent, appendFunction) { //parameters optional.

                    //if its a list of views, render them all
                    if (viewModels && viewModels.length) {
                        viewModels.fastEach(function (viewModel, index) {
                            renderView(viewModel, parent, appendFunction, index);
                        });
                    }

                    //if its just one view, just render it
                    else if (viewModels) {
                        renderView(viewModels, parent, appendFunction);
                    }

                    //if nothing is passed in, render ALL the viewModels!
                    else {
                        var renderTarget = this.renderTarget || document.getElementsByTagName('body')[0];
                        internalViewModels.fastEach(function (internalViewModel, index) {
                            renderView(internalViewModel, renderTarget, appendFunction, index);
                        });
                    }
                },

                //Add a view or viewModels to another view, or the root list of viewModels if a parent isnt passed.
                //Set up the viewModels bindings as they are added.
                add: function (viewModels, parentView, parentViewChildArray, index) {
                    //if the viewModels isnt an array, make it one.
                    if (viewModels && !viewModels.length) {
                        viewModels = [viewModels];
                    }

                    viewModels.fastEach(function (viewModel) {
                        if (gaffa.views[viewModel.type] !== undefined) {
                            
                            
                            if (parentView && parentViewChildArray) {
                                viewModel.parent = parentView;
                                if(index != null){
                                    parentViewChildArray.splice(index, 0, viewModel);
                                }else{
                                    parentViewChildArray.push(viewModel);
                                }
                            } else {
                                internalViewModels.push(viewModel);
                            }
                            
                            //bind ALL the things!
                            bindView(viewModel);
                        } else {
                            console.error("No view is loaded to handle view of type " + viewModel.type);
                        }
                    });
                },

                get: function (path) {
                    return get(path, internalViewModels);
                },

                set: function (path, value) {
                    if (path !== undefined && path.isArray) {
                        while (internalViewModels.length) {
                            var parent;

                            value = internalViewModels.pop();
                            if (value.renderedElement && (parent = value.renderedElement.parentNode)) {
                                parent.removeChild(value.renderedElement);
                            }
                        }
                        this.add(path);


                        return this.render();
                    }

                    var viewModel,
                        subPath = path.split(gaffa.pathSeparator),
                        viewModelPathLength = subPath.length;

                    while (!(viewModel && viewModel.isView)) {
                        viewModel = get(subPath.slice(0, viewModelPathLength--).join(gaffa.pathSeparator), internalViewModels);
                    }

                    set(path, value, internalViewModels);

                    if (viewModel.properties && gaffa.views[viewModel.type]) {
                        for (var key in viewModel.properties) {
                            gaffa.views[viewModel.type].update[key](viewModel, true);
                        }
                    }

                    this.render();
                },

                //All viewModels get extended with the object that this returns.
                base: function (viewType, createElement, defaults) {
                    return {
                        //This is executed when a view is inserted into the page
                        render: function (viewModel) {
                            //only render if the view has not previously been rendered.
                            if (viewModel.renderedElement) {
                                return;
                            }

                            //extend the passed in view with default options for that view type.
                            extend(viewModel, defaults);

                            //create the root level element for the view
                            viewModel.renderedElement = createElement(viewModel);
                            viewModel.renderedElement.viewModel = viewModel;

                            //Automatically fire all of the update functions when the view is first rendered.
                            for (var key in viewModel.properties) {
                                var updateFunction = gaffa.views[viewType].update[key];
                                if (updateFunction && typeof updateFunction === "function") {
                                    updateFunction(viewModel, viewModel.properties[key].value, true);
                                }
                            }
                        },

                        //functions under this are executed whenever the data bound to by properties of the same name changes.
                        update: {
                            //optionally put standard update methods in here, like for example view visibility:
                            visible: gaffa.propertyUpdaters.bool("visible", function (viewModel, value) {
                                if (value === false) {
                                    $(viewModel.renderedElement).css("display", "none");
                                } else {
                                    $(viewModel.renderedElement).css("display", "");
                                    
                                }
                            }),

                            classes: function (viewModel, value, firstRun) {
                                if (viewModel.properties.classes.value !== value || firstRun) {
                                    var element = $(viewModel.renderedElement);
                                    if (element) {
                                        if (viewModel.properties.classes.value) {
                                            element.removeClass(viewModel.properties.classes.value);
                                        }
                                        element.addClass(viewModel.properties.classes.value = value);
                                    }
                                }
                            }
                        },

                        defaults: {
                            //Set the default view binding to nothing but a relative path.
                            //This is so all relative bindings flow on nicely.
                            insertFunction: insertView,
                            path: gaffa.pathStart + gaffa.relativePath +  gaffa.pathEnd,
                            properties: {
                                visible: { value: true },
                                classes: {}
                            },
                            isView: true
                        }
                    };
                }
            },

            actions: {
                add: function(key, actions){
                    if(!Array.isArray(actions)){
                        actions = [actions];
                    }
                    
                    internalActions[key] = actions;
                },
                trigger: function (actions, parent) {
                    if(typeof actions === "string"){
                        actions = internalActions[actions];
                    }
                    actions.fastEach(function (action) {
                        triggerAction(action, parent);
                    });
                }
            },

            behaviours: {
                add: function (behaviours) {
                    //if the views isnt an array, make it one.
                    if (behaviours && !behaviours.length) {
                        behaviours = [behaviours];
                    }

                    behaviours.fastEach(function (behaviour) {
                        var behaviourType = behaviour.type;
                        if(typeof gaffa.behaviours[behaviourType] === "function"){
                            gaffa.behaviours[behaviourType](behaviour);
                        }
                    });
                },
                
                pageLoad: function(behaviour){
                    gaffa.actions.trigger(behaviour.actions, behaviour.binding);
                },
                
                modelChange: function(behaviour){
                    gaffa.model.bind(behaviour.binding.split('/').join("_"), function () {
                        var throttleTime = behaviour.throttle;
                        if(!isNaN(throttleTime)){
                            var now = new Date();
                            if(!behaviour.lastTrigger || now - behaviour.lastTrigger > throttleTime){
                                behaviour.lastTrigger = now;
                                gaffa.actions.trigger(behaviour.actions, behaviour.binding);
                            }else{
                                clearTimeout(behaviour.timeout);
                                behaviour.timeout = setTimeout(function(){
                                        behaviour.lastTrigger = now;
                                        gaffa.actions.trigger(behaviour.actions, behaviour.binding);
                                    },
                                    throttleTime - (now - behaviour.lastTrigger)
                                );
                            }
                        }else{
                            gaffa.actions.trigger(behaviour.actions, behaviour.binding);
                        }
                    });
                }
            },

            utils: {
                get: get,
                
                set: set,
                //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
                getProp: function (object, propertiesString) {
                    var properties = propertiesString.split(gaffa.pathSeparator).reverse();
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
                }
            },

            propertyUpdaters: {

                string: function (propertyName, callback, setValue) {
                    if (typeof propertyName === "object") {
                        //passed a property object, doing a set.
                        var viewModel = propertyName,
                        propertyObject = callback,
                        string = setValue;
                        
                        gaffa.model.set(propertyObject.binding, string, viewModel);
                    } else {
                        return function (viewModel, firstRun) {
                            var property = viewModel.properties[propertyName],
                                element = viewModel.renderedElement,
                                convertDateToString = function (date){
                                    if(date && date instanceof Date && typeof gaffa.dateFormatter === "function"){
                                        return gaffa.dateFormatter(date);
                                    }else{
                                        return date;
                                    }
                                };
                                
                            if (property.value !==  property.previousValue || firstRun) {
                                property.value = convertDateToString(property.value);
                                if (element) {
                                    callback(viewModel, property.value);
                                }
                            }
                            property.previousValue = property.value;
                        };
                    }
                },
                
                number: function (propertyName, callback, setValue) {
                    if (typeof propertyName === "object") {
                        //passed a property object, doing a set.
                        var viewModel = propertyName,
                        propertyObject = callback,
                        number = setValue;

                        gaffa.model.set(propertyObject.binding, number, viewModel);
                        
                    } else {
                        return function (viewModel, firstRun) {
                            var property = viewModel.properties[propertyName],
                                value = property.value,
                                element = viewModel.renderedElement;
                            
                            if (property.previousValue !== value || firstRun) {
                                property.previousValue = value;
                                if (element) {
                                    callback(viewModel, value);
                                }
                            }
                        };
                    }
                },
                
                collection: function (propertyName, insert, remove) {
                    return function (viewModel, firstRun) {
                        var property = viewModel.properties[propertyName],
                            sort = property.sort,
                            valueLength = 0,
                            childViews = viewModel.viewContainers[propertyName],
                            value = property.value,
                            calculateValueLength = function(){
                                if(value.isArray){
                                    return value.length;
                                }else if(typeof value === "object"){
                                    return Object.keys(value).length;
                                }
                            };
                            
                        if (value && typeof value === "object"){

                            var element = viewModel.renderedElement;
                            if (element && property.template) {
                                var newView;
                                
                                //Remove any child nodes who no longer exist in the data
                                for(var i = 0; i < childViews.length; i++){
                                    var childView = childViews[i];
                                    if(!value[childView.key]){
                                        childViews.splice(i, 1);
                                        i--;
                                        remove(viewModel, value, childView);
                                    }
                                }
                                
                                //Add items which do not exist in the dom
                                for (var key in value) {
                                    if(value.isArray && isNaN(key)){
                                        continue;
                                    }
                                    var existingChildView = false;
                                    for(var i = 0; i < childViews.length; i++){
                                        var child = childViews[i];
                                        if(child.key === key){
                                            existingChildView = child;
                                        }
                                    }
                                    
                                    var index;
                                    
                                    if (!existingChildView) {
                                        newView = {key: key};
                                        insert(viewModel, value, newView, index);
                                    }
                                }
                                    
                                if(sort){
                                    childViews.sort(function(a,b){
                                    
                                        //Im hyjacking the fact that sort hits every childView
                                        //to reset the isRendered flag. I could run a loop before this that
                                        //reset it but this cuts down on a loop...
                                        b.isRendered = false;
                                        
                                        return gaffa.utils.getProp(value[a.key], sort) > gaffa.utils.getProp(value[b.key], sort);
                                    });
                                    
                                    window.gaffa.views.render(childViews, childViews.element);
                                }
                            }
                        }else{
                            childViews.fastEach(function(childView, index){
                                childViews.splice(index, 1);
                                remove(viewModel, value, childView);
                            });
                        }
                    };
                },
                
                group: function (propertyName, insert, remove) {
                    return function (viewModel, firstRun) {
                        var property = viewModel.properties[propertyName],
                            value = property.value,
                            childViews = viewModel.viewContainers[propertyName],
                            newView;
                        
                        if (value && typeof value === "object"){
                            
                            viewModel.distinctGroups = getDistinctGroups(property.value, property.group);
                            
                            for(var i = 0; i < childViews.length; i++){
                                var childView = childViews[i];
                                if(viewModel.distinctGroups.indexOf(childView.group)<0){
                                    childViews.splice(i, 1);
                                    i--;
                                    remove(viewModel, value, childView);
                                }
                            }
                            
                            viewModel.distinctGroups.fastEach(function(group){
                                var exists = false;
                                childViews.fastEach(function(child){
                                    if(child.group === group){
                                        exists = true;
                                    }
                                });
                                
                                if (!exists) {
                                    newView = {group: group};
                                    insert(viewModel, value, newView);
                                }
                            });
                        }else{
                            childViews.fastEach(function(childView, index){
                                childViews.splice(index, 1);
                                remove(viewModel, property.value, childView);
                            });
                        }
                    };
                },

                bool: function (propertyName, callback, value) {
                    if (typeof propertyName === "object") {
                        //passed a property object, doing a set.
                        var viewModel = propertyName,
                        propertyObject = callback;

                        gaffa.model.set(propertyObject.binding, value, viewModel);
                        
                    } else {
                        return function (viewModel, firstRun) {
                            var property = viewModel.properties[propertyName],
                                value = property.value;
                            if (property.previousValue !== value || firstRun) {
                                property.previousValue = value;
                                callback(viewModel, property.value);
                            }
                        };
                    }
                },
                
                // ToDo: I dont like this...
                object: function (propertyName, callback) {
                    return function (viewModel, firstRun) {
                        var property = viewModel.properties[propertyName],
                            value = property.value;

                        callback(viewModel, property.value);
                    };
                }
            },

            navigate: navigate,
            
            load: function(app, pushPageState){
                        
                var title;
                        
                if(app !== undefined && app !== null && app.title){
                    title = app.title;
                }
                if(pushPageState){
                    // ToDo: Push state no worksies in exploder.
                    window.history.pushState(app, title, document.location);
                }
                load(app);
            },
            
            //If you want to load the values in query strings into the pages model.
            queryStringToModel: queryStringToModel,
            
            //This is here so i can remove it later and replace with a better verson.
            extend: extend,
            
            clone: function(value){
                if(typeof value === "object"){
                    if(value.isArray){
                        return value.slice();
                    }else if (value instanceof Date) {
                        return new Date(value);
                    }else{
                        return $.extend(true, {}, value);
                    }
                }else{
                    return value;
                }
            }

        };

        return new innerGaffa();

    }
})();
