//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (undefined) {
    "use strict";

    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa(),
        gel = window.gel,
        history = window.History || window.history; //Allow custom history implementations if defined.
        
    

    //"constants"
    gaffa.pathSeparator = "/";
    gaffa.upALevel =  "..";
    gaffa.relativePath = "~";
    gaffa.pathStart = "[";
    gaffa.pathEnd = "]";
    gaffa.pathWildcard = "*";
    
    //internal varaibles
    
        // Storage for the applications model 
    var internalModel = {},
    
        // Storage for the applications view.
        internalViewModels = [],

        // Storage for model event handles
        internalBindings = [],
        
        // Storage for application global events.
        internalActions = {},
        
        // Storage for application notifications
        internalNotifications = {},
        
        // Storage for interval based behaviours
        internalIntervals = [],
        
        // Storage for tracking the sirty state of the model
        dirtyModel = {},

        // Storage for the memoised version of the model *CURRENTLY NOT IN USE*
        memoisedModel = {},
        
        // Whether model events are paused
        eventsPaused = false,
        
        // Storage for applications default styles
        defaultViewStyles;
        

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
    //      Path token converter
    //
    //***********************************************
    
    function detectPathToken(expression) {
        if (expression.charAt(0) === '[') {
            var index = 1,
                escapes = 0;
            do {
                if (expression.charAt(index) === '\\' && (expression.charAt(index+1) === '[' || expressioncharAt(index+1) === ']')) {
                    expression = expression.slice(0, index) + expression.slice(index + 1);
                    index++;
                    escapes++;
                }
                else {
                    index++;
                }
            } while (expression.charAt(index) !== ']' && index < expression.length);

            if (index > 1) {
            var value = expression.slice(0, index + 1);
                return {
                value: value,
                    index: index + escapes + 1,
                callback: function(value, scopedVariables) {
                    return get(Path.parse(scopedVariables._gaffaModelContext_).append(value), internalModel);
                    }
                };
            }
        }
    }

    //***********************************************
    //
    //      Gel integration
    //
    //***********************************************

    if(gel){
        gel.tokenConverters.others.path = detectPathToken;
        
        gel.functions.isDirty = isDirty;
        
        gel.functions.getAllDirty = function(path){
            var path = Path.parse(this._gaffaModelContext_).append(path),
                source = gaffa.model.get(path),
                result,
                itemPath
            if(source == null){
                return null;
            }
            
            result = source.constructor();
            
            for(var key in source){
                if(source.hasOwnProperty(key)){
                    itemPath = path.append(gaffa.relativePath + gaffa.pathSeparator + key);
                    if(result instanceof Array){
                        isDirty(itemPath) && result.push(source[key]);
                    }else{
                        isDirty(itemPath) && (result[key] = source[key]);
                    }
                }
            }
            
            return result;
        };
    }

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

    function navigate(url, model, post, pushState) {
        
        gaffa.notifications.notify("navigation.begin");
        $.ajax({
        
            // Internet explorer is an ABSOLUTE PIECE OF SHIT.
            // If you don't set this to false, it JUST RESPONDS WITH WHATEVER IT LAST GOT FROM THAT URL.
            // Changed the contentType to application/json? WHO CARES! JUST FUCKING RESPOND WITH HTML :D!
            
            // I fucking hate internet explorer.
        
            cache: !$.browser.msie,
            url: url,
            type: (post && "post") || "get",
            contentType: "application/json; charset=utf-8",
            data: "",
            dataType: "json",
            success: function (data) {
                var title;
                        
                if(data !== undefined && data !== null && data.title){
                    title = data.title;
                }
                
                // Always use pushstate unless triggered by onpopstate
                !(pushState === false) && history.pushState(data, title, url);
                
                load(data, model);
                
                gaffa.notifications.notify("navigation.success");
                
                window.scrollTo(0,0);
            },
            error: function(error){
                gaffa.notifications.notify("navigation.error", error);
            },
            complete: function(){
                gaffa.notifications.notify("navigation.complete");
            }
        });
    }
    
    //***********************************************
    //
    //      Pop State
    //
    //***********************************************

     // ToDo: Pop state no worksies in exploder.
    window.onpopstate = function(event){
        if(event.state){
        
            navigate(window.location.toString(),undefined,undefined,false);
            
            //load(event.state);
            
        }
    };

    //***********************************************
    //
    //      Load
    //
    //***********************************************
    
    function load(app, model){
    
        memoisedModel = {};
        internalBindings = [];
        while(internalIntervals.length){
            clearInterval(internalIntervals.pop());
        }

        //clear state first
        if (app.views) {
            gaffa.views.set([]);
        }
        if (app.model) {
            internalModel = {};
        }
        
        //set up state
        if (app.model) {
            gaffa.model.set(app.model, null, null, false);
        }
        if (app.views) {
            gaffa.views.set(app.views);
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
       
    //***********************************************
    //
    //      Get Distinct Groups
    //
    //***********************************************
    
    function getDistinctGroups(collection, property){
        var distinctValues = [];
        
        if(collection && typeof collection === "object"){
            if(Array.isArray(collection)){
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
                        
            var reference = model;

            path = Path.parse(path);
            
            path.fastEach(function(key, index){
                if (reference === null || reference === undefined) {
                    return true;
                } else if (typeof reference[key] === "object") {
                    reference = reference[key];

                    /*
                    else if there isn't anything at this key, exit the loop,
                    and return undefined.
                    */
                }
                else if (reference[key] === undefined) {
                    reference = undefined;
                    return true;

                    /*
                    otherwise, we're at the end of the line. return whatever's
                    there
                    */
                }
                else {
                    reference = reference[key];
                    return true;
                }
            });
            
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
        
        //If you just pass in an object, you are overwriting the model.
        if (typeof path === "object" && !(path instanceof Path) && !(path instanceof Expression)) {
            for (var modelProp in model) {
                delete model[modelProp];
                gaffa.model.trigger(modelProp);
            }
            for (var pathProp in path) {
                model[pathProp] = path[pathProp];
                gaffa.model.trigger(new Path(pathProp), model[pathProp]);
            }
            return;
        }
        
        path = Path.parse(path);

        var reference = model;

        path.fastEach(function (key, index, path) {
            
            //if we have hit a non-object property on the reference and we have more keys after this one
            //make an object (or array) here and move on.
            if ((typeof reference[key] !== "object" || reference[key] === null) && index < path.length - 1) {
                if (!isNaN(key)) {
                    reference[key] = [];
                }
                else {
                    reference[key] = {};
                }
            }
            if (index === path.length - 1) {
                // if we are at the end of the line, set to the model
                reference[key] = value;
                }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];
            }
        });

        //memoisedModel[model] = {};

        gaffa.model.trigger(path);
    }

    //***********************************************
    //
    //      Remove
    //
    //***********************************************

    function remove(path, model) {
        var reference = model;

        path = Path.parse(path);
        
        path.fastEach(function (key, index, path) {
            //if we have hit a non-object and we have more keys after this one,
            //return
            if (typeof reference[key] !== "object" && index < path.length - 1) {
                return;
            }
            if (index === path.length - 1) {
                // if we are at the end of the line, delete the last key
                
                if (!isNaN(reference.length)) {
                    reference.splice(key, 1);
                }else{
                    delete reference[key];
                }
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];
            }
        });

        memoisedModel[model] = {};

        gaffa.model.trigger(path);
    }

    //***********************************************
    //
    //      Trigger Binding
    //
    //***********************************************

    function triggerBinding(path, modelChangeEvent) {
        if(eventsPaused){
            return;
        }
            
        path = Path.parse(path);

        var reference = internalBindings,
            references = [];

        modelChangeEvent = modelChangeEvent || {
            target: path
        };

        function triggerListeners(reference, sink){
            if (reference != undefined && reference !== null) {
                reference.fastEach(function (callback) {
                    
                    callback(modelChangeEvent);
                    
                });
                if(sink){
                    for (var key in reference) {
                        if (reference.hasOwnProperty(key) && Array.isArray(reference[key])) {                            
                            triggerListeners(reference[key],sink);
                        }
                    }
                }
            }
        }

        path.fastEach(function (key) {

            if (!isNaN(key) || Array.prototype.hasOwnProperty(key)) {
                key = "_" + key;
            }

            if (reference !== undefined && reference !== null) {
                reference = reference[key];
                references.push(reference);
            }
        });

        triggerListeners(references.pop(), true);

        while(references.length){
            var reference = references.pop();
                
            triggerListeners(reference);
        }
    }
    
    //***********************************************
    //
    //      Pause Model Events
    //
    //***********************************************
    
    function pauseModelEvents(){
        eventsPaused = true;
    }

    //***********************************************
    //
    //      Resume Model Events
    //
    //***********************************************
        
    function resumeModelEvents(){
        eventsPaused = false;
    }

    //***********************************************
    //
    //      Set Binding
    //
    //***********************************************

    function setBinding(binding, callback) {
    
        var path,
            reference = internalBindings;
    
        //If the binding has opperators in it, break them apart and set them individually.
        if(!(binding instanceof Path)){
            var bindingParts = getPathsInExpression(binding);
                
            bindingParts.fastEach(function (path) {
                setBinding(path, callback);
            });
            return;
        }

        path = binding;

        path.fastEach(function (key, index, path) {
            
            //escape properties of the array with an underscore.
            // numbers mean a binding has been set on an array index.
            // array property bindings like length can also be set, and thats why all array properties are escaped.
            if (!isNaN(key) || [].hasOwnProperty(key)) {
                key = "_" + key;
            }

            //if we have more keys after this one
            //make an array here and move on.
            if (typeof reference[key] !== "object" && index < path.length - 1) {
                reference[key] = [];
                reference = reference[key];
            }
            else if (index === path.length - 1) {
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
    //      De-Dom
    //
    //***********************************************
    
    function deDom(node){
        var parent = node.parentNode,
            nextSibling;
            
        if(!parent || parent.childNodes.length<16){
            return false;
        }
        
        nextSibling = node.nextSibling;
            
        parent.removeChild(node);
        
        return function(){
            if(nextSibling){
                parent.insertBefore(node, nextSibling);
            }else {
                parent.appendChild(node);
            }
        };
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
        
        var view = gaffa.views[viewModel.type];

        //Check if a renderer for the view type is loaded.
        if (view !== undefined) {
            //it is, so render it.
            view.render(viewModel);
            
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
                        typeof view.afterInsert === 'function' && view.afterInsert(viewModel);
                    }
                }
                
                //Render child views
                for (var key in viewModel.viewContainers) {
                    viewModel.viewContainers[key].fastEach(function (childViewModel) {
                        renderView(childViewModel, viewModel.viewContainers[key].element);
                    });
                }

                //Bind the views actions
                //ToDo: this probaly shouldn't be here. refactor.
                if (viewModel.actions) {
                    for (var actionKey in viewModel.actions) {
                        var action = viewModel.actions[actionKey];
                        if (!action.bound) {
                            $(viewModel.renderedElement).on(actionKey, function (event) {
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
    function triggerAction(action, parent, context) {
        //bind each of the action properties to the model.
        
        var absoluteActionPath;
        
        action.parent = parent;
        action.context = context;
        
        absoluteActionPath = context || action.getPath();
        
        for (var propertyName in action.properties) {
            var property = action.properties[propertyName];
            if (property && property.binding) {
                property.value = gaffa.model.get(property.binding, absoluteActionPath);
            }
        }
        if(typeof action.trigger === "function"){
            // New way
            action.trigger();
        }else if (typeof gaffa.actions[action.type] === "function") {
            // Legacy way
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
            
                property.binding = new Expression(property.binding);
            
                var paths = property.binding.paths,
                    absoluteViewPath = viewModel.getPath();
                    
                paths.fastEach(function(path){
                    path = absoluteViewPath.append(path);

                    // this function is to create a closure so that 'propertyName' is still the same when the event fires.
                    (function (propertyName, property, path, absoluteViewPath) {
                        if (path.length) {
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
        var paths = [],
            expressionString = exp instanceof Expression ? exp.original : exp;
            
        if(gel){
            var tokens = gel.getTokens(expressionString, 'path');
            tokens.fastEach(function(token){
                paths.push(Path.parse(token.value));
            });
        }else{
            return [expressionString];
        }
        return paths;
    }
    
    //***********************************************
    //
    //      Get ViewItem Path
    //
    //***********************************************

    function getViewItemPath(){
        var args = Array.prototype.slice.call(arguments),
            paths = [],
            parent = this;
        
        // Push + Reverse is the fasterestest at the moment...
        // http://jsperf.com/array-push-vs-unshift/11
        
        while(parent){
            if(parent.key){
                paths.push(new Path(gaffa.relativePath + gaffa.pathSeparator + parent.key));
            }
            if(parent.context){
                paths.push(new Path(parent.context));
            }
            paths.push(parent.path);
            parent = parent.parent;
        }
        
        return getAbsolutePath.apply(this, paths.reverse());
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
            absoluteParts = [];            
            
        args.fastEach(function(path){
            path = Path.parse(path);
        
            path.fastEach(function(pathPart, partIndex, parts){
        
                if(pathPart === gaffa.upALevel){
                // Up a level? Remove the last item in absoluteParts
                    absoluteParts.pop();
                    
                }else if(pathPart === gaffa.relativePath){
                // Relative path? Do nothing
                    return;
                    
                }else if(pathPart === '' && parts.length > 1){
                // more than 1 part beginning with a pathSeparator? Reset absoluteParts to root.
                    absoluteParts = [];
                    
                }else if(partIndex){
                // any following valid part? Add it to the absoluteParts.
                    absoluteParts.push(pathPart);
                    
                }else if(pathPart.indexOf(gaffa.relativePath) === 0){
                //***********************************************
                //
                //      ToDo: LEGACY CODE SUPPORT. PHAZE OUT FOR 0.2.0
                //
                //      relative paths without the dividing slash eg: ~thing
                //
                //***********************************************
                    absoluteParts.push(pathPart.slice(1));
                    
                }else if(pathPart.indexOf(gaffa.upALevel) === 0){
                //***********************************************
                //
                //      ToDo: LEGACY CODE SUPPORT. PHAZE OUT FOR 0.2.0
                //
                //      up a level paths without the dividing slash eg: ..thing
                //
                //***********************************************
                    absoluteParts.pop();
                    absoluteParts.push(pathPart.slice(1));
                    
                }else{
                // Absolute path, clear the current absoluteParts
                    absoluteParts = [pathPart];
                    
        }
            });
        });
        
        // Convert the absoluteParts to a Path.
        return new Path(absoluteParts);
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
                    if(sourceProperty instanceof Array){
                        targetProperty = new sourceProperty.constructor();
                        sourceProperty.fastEach(function(value){
                            var item = new value.constructor();
                            internalExtend(item, value);
                            targetProperty.push(item);
                        });
                    }else{
                        if(visited.indexOf(sourceProperty)>=0){
                            target[key] = sourceProperty;
                            continue;
                        }
                        visited.push(sourceProperty);
                        targetProperty = targetProperty || new sourceProperty.constructor();
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
            
        subKinds.fastEach(function(subKind, index){
            var notificationKind = subKinds.slice(0, index + 1).join(".");
            
            internalNotifications[notificationKind] && internalNotifications[notificationKind].fastEach(function(callback){
                callback(data);
            });            
        });
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
            break;
            
            case 'number': 
                if(isNaN(a) && isNaN(b)){
                    return true;
                }
                return a === b;
            break;
            
            case 'date': return +a === +b;
            break;
                        
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
            defaultViewStyles = document.createElement('style');
            defaultViewStyles.setAttribute("type", "text/css");
            defaultViewStyles.className = "dropdownDefaultStyle";
        
            //Prepend so it can be overriden easily.
            $("head").prepend(defaultViewStyles);
            
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
    //      Add View
    //
    //***********************************************
    
    function addView(viewModel, parentView, parentViewChildArray, index) {
        //if the viewModels isnt an array, make it one.
        if (viewModel instanceof Array) {
            viewModel.fastEach(function (viewModel) {
                addView(viewModel, parentView, parentViewChildArray, index)
            });
            return;
        }
        
        if (!gaffa.views[viewModel.type]) {
            console.error("No view is loaded to handle view of type " + viewModel.type);
        }
        
        if(!(viewModel instanceof View)){
            viewModel = new View(viewModel);
        }
            
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
        
        viewModel.bind();
    }
        
    //***********************************************
    //
    //      Model Get
    //
    //***********************************************
    
    function modelGet (binding, parentPath) {
        if(binding && gel){
            var gelResult,
                expression = binding,
                context = {
                    "_gaffaModelContext_": parentPath
                };
                
            if(binding instanceof Path || binding instanceof Expression){
                expression = binding.toString();
            }
            
            gelResult = gel.parse(expression, context);
            
            return gelResult;
        }
        if(parentPath){
            binding = getAbsolutePath(parentPath, binding);
        }
        return get(binding, internalModel);
    }  
        
    //***********************************************
    //
    //      Set Dirty State
    //
    //***********************************************  
    
    function setDirtyState(path, dirty){
        var reference = dirtyModel;
        
        dirty = dirty !== false;
        
        path = Path.parse(path);
        
        path.fastEach(function(key, index){
            if ((typeof reference[key] !== "object" || reference[key] === null) && index < path.length - 1) {
                reference[key] = {};
            }
            if (index === path.length - 1) {
                reference[key] = {};
                reference[key]['_isDirty_'] = dirty;
            }
            else {
                reference = reference[key];
            }
        });
    }
        
    //***********************************************
    //
    //      Is Dirty
    //
    //***********************************************  
    
    function isDirty(path){
        var reference,
            hasDirtyChildren = function(ref){ 
                if(typeof ref !== 'object'){
                    return false;
                }
                if(ref['_isDirty_']){
                    return true;
                }else{
                    for(var key in ref){
                        if(hasDirtyChildren(ref[key])){
                            return true;
                        }
                    }
                }
            };
        
        path = Path.parse(path);
        
        reference = get(path, dirtyModel);
        
        return !!hasDirtyChildren(reference);
    }

    //Public Objects ******************************************************************************
    
    //***********************************************
    //
    //      ViewItem Object
    //
    //***********************************************
    
    function ViewItem(viewItemDescription){
        if(!viewItemDescription){
            return this;
        }
        
        extend(this, viewItemDescription);
        
        this.path == null && (this.path = "[~]");
        
        this.path = Path.parse(this.path);
    }    
    ViewItem.prototype.bind = function(){
        for(var key in this.actions){
            this.actions[key].fastEach(function(action, index, actions){
                if(gaffa.actions[action.type].prototype instanceof Action){
                    // New way
                    actions[index] = new gaffa.actions[action.type](action);
                }else{
                    // Legacy way
                    actions[index] = new Action(action);
                }
                actions[index].bind();
            });
        }
    };
    ViewItem.prototype.getPath = getViewItemPath;
    
    //***********************************************
    //
    //      View Object
    //
    //***********************************************
    
    function View(viewDescription){
        this.constructor.call(this, viewDescription);
        
        var constructor = gaffa.views[this.type];
        
        if(!constructor){
            console.error("No constructor is defined for the view of type: " + this.type);
        }
        
        for(var key in constructor.defaults){
            extend(this, constructor.defaults);
        }
    }
    View.prototype = new ViewItem();        
    View.prototype.bind = function(){
        this.constructor.prototype.bind.call(this);
        
        for(var key in this.views){
            addView(this.views[key], this, this.viewContainers[key]);
        }
                         
        bindProperties(this);
    };
    
    //***********************************************
    //
    //      Action Object
    //
    //***********************************************
    
    function Action(actionDescription){
        this.constructor.apply(this, arguments);
    }
    Action.prototype = new ViewItem();
    
    //***********************************************
    //
    //      Behaviour Object
    //
    //***********************************************
    
    function Behaviour(behaviourDescription){
        this.constructor.apply(this, arguments);
        
        this.path == null && (this.path = "[~]");
        
        this.path = Path.parse(this.path);
    } 
    Behaviour.prototype = new ViewItem();
    
    //***********************************************
    //
    //      Path Object
    //
    //***********************************************
    
    function Path(path){
        var self = this,
            absolute = false;
        
        //Passed a Path? pass it back.
        if(path instanceof Path){
            return path.slice();
        }
        
        //passed a string or array? make a new Path.
        if(typeof path === "string"){
            if(path.charAt(0)===gaffa.pathStart){
                path = pathToRaw(path);
            }
            var keys = path.split(gaffa.pathSeparator);
            keys.fastEach(function (key) {
                self.push(key);
            });
        }else if(path instanceof Array){
            path.fastEach(function (key) {
                self.push(key);
            });
        }
        
        self.original = path;
    }
    Path.prototype = new Array();
    Path.prototype.toString = function(){
        var str = this.join(gaffa.pathSeparator);
        return str && rawToPath(str) || undefined;
    };
    Path.prototype.toRawString = function(){
        return this.join(gaffa.pathSeparator);
    };
    Path.prototype.slice = function (){
        return new Path(Array.prototype.slice.apply(this, arguments));
    };
    Path.prototype.splice = function (){
        return new Path(Array.prototype.splice.apply(this, arguments));
    };
    Path.prototype.append = function(){
        var args = Array.prototype.slice.call(arguments),
            newPath = this.slice();
            
        return getAbsolutePath.apply(this, [this].concat(args));
    };
    Path.prototype.last = function(){
        return this[this.length-1];
    };
    Path.parse = function(path){
    
        if(path instanceof Expression){
        // Check if the passed in path is an Expression, that is also just a Path.
        
            var detectedPathToken = detectPathToken(path.original);
            
            if(detectedPathToken.index === path.original.length){
                path = new Path(detectedPathToken.value);
            }else{
                console.warn('could not parse Expression directly to Path');
            }
        }
        
        return path instanceof this && path || new Path(path);
    };
    Path.mightParse = function(path){    
        return path instanceof this || path instanceof Expression || typeof path === 'string' || Array.isArray(path);
    };
    
    //***********************************************
    //
    //      Expression Object
    //
    //***********************************************
    
    function Expression(expression){
        var self = this,
            absolute = false;
        
        //Passed an Expression? pass it back.
        if(expression instanceof Expression){
            return expression;
        }
        
        //passed a string or array? make a new Expression.
        if(typeof expression === "string"){
            var tokens = gel.tokenise(expression);
            tokens.fastEach(function (key) {
                self.push(key);
            });
        }
        
        self.original = expression;
        
        self.paths = getPathsInExpression(self);
    }
    Expression.prototype = new Array();
    Expression.prototype.toString = function(){
        return this.original;
    };
    Expression.parse = function(expression){        
        expression instanceof Path && (expression = expression.toString());
        
        return expression instanceof this && expression || new Expression(expression);
    };
    
    //***********************************************
    //
    //      Property Object
    //
    //***********************************************
    
    function Property(propertyDescription){
        if(propertyDescription){
            extend(this, propertyDescription);
        }
        
        if(this.binding != null){
            this.binding = Expression.parse(this.binding);
        }
    }    
    Property.prototype.bind = function(parent){
        this.parent = parent;
    };
    Property.prototype.getPath = getViewItemPath;
    
    //***********************************************
    //
    //      View Container Object
    //
    //***********************************************
    
    function ViewContainer(viewContainerDescription){
        if(viewContainerDescription){
            extend(this, viewContainerDescription);
        }
        
        this.render = new Property(this.render || {value:true});
        this.render.update = function(viewModel){
            
        };
    }    
    ViewContainer.prototype.bind = function(parent){
        this.parent = parent;
    };
    ViewContainer.prototype.getPath = getViewItemPath;

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
            addDefaultStyle: addDefaultStyle,
            Path: Path,
            Expression: Expression,
            ViewItem: ViewItem,
            View: View,
            Action: Action,
            Property: Property,
            paths: {
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
            
                // *************************************************************************
                // DO NOT USE THIS API.
                // If you are using this, you are almost definitally doing something wrong.
                pauseEvents: pauseModelEvents,
                resumeEvents: resumeModelEvents,
                // *************************************************************************
                                
                get: modelGet,

                set: function (path, value, viewItem, dirty) {
                    if(Path.mightParse(path)){
                        if(viewItem){
                            path = viewItem.getPath().append(path);
                        }                    
                        
                        setDirtyState(path, dirty);
                    }
                    
                    set(path, value, internalModel);
                },
                
                remove: function (path, viewItem, dirty) {
                    if(Path.mightParse(path)){
                        if(viewItem){
                            path = viewItem.getPath().append(path);
                        }
                        
                        setDirtyState(path, false, dirty);
                    }
                    
                    remove(path, internalModel);
                },

                bind: setBinding,

                trigger: triggerBinding,
                
                isDirty: isDirty,
                
                setDirtyState: function(path, dirty, viewItem){
                    if(Path.mightParse(path)){
                        if(viewItem){
                            path = viewItem.getPath().append(path);
                        }
                    }
                    
                    return setDirtyState(path, dirty);
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
                add: addView,

                get: function (path) {
                    return get(path, internalViewModels);
                },

                set: function (path, value) {
                    if (path !== undefined && Array.isArray(path)) {
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
                                    updateFunction(viewModel, true);
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

                            classes: gaffa.propertyUpdaters.string("classes", function (viewModel, value) {
                                var internalClassNames = viewModel.renderedElement.internalClassNames = viewModel.renderedElement.internalClassNames || $(viewModel.renderedElement).attr("class");
                                $(viewModel.renderedElement).attr("class", internalClassNames + " " + value);
                            })
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
                trigger: function (actions, parent, context) {
                    if(typeof actions === "string"){
                        actions = internalActions[actions];
                    }
                    actions instanceof Array && actions.fastEach(function (action) {
                        triggerAction(action, parent, context);
                    });
                }
            },

            behaviours: {
                add: function (behaviours) {
                    //if the views isnt an array, make it one.
                    if (behaviours && !behaviours.length) {
                        behaviours = [behaviours];
                    }

                    behaviours.fastEach(function (behaviour, index, behaviours) {
                    
                        behaviour = behaviours[index] = new Behaviour(behaviour);
                        
                        behaviour.bind();
                        
                        var behaviourType = behaviour.type;
                        
                        if(typeof gaffa.behaviours[behaviourType] === "function"){
                            behaviour.path = Path.parse(behaviour.path);
                            gaffa.behaviours[behaviourType](behaviour);
                        }
                    });
                },
                
                pageLoad: function(behaviour){
                    gaffa.actions.trigger(behaviour.actions.load, behaviour);
                },
                
                modelChange: function(behaviour){
                
                    function executeBehaviour(behaviour, context){
                        var currentValue = JSON.stringify(gaffa.model.get(behaviour.path));
                            if(currentValue !== behaviour.previousValue){
                                behaviour.previousValue = currentValue;
                                gaffa.actions.trigger(behaviour.actions.change, behaviour, context);
                            }
                    }
                
                    gaffa.model.bind(behaviour.path, function (modelChangeEvent) {
                        var context;
                        if(behaviour.context){
                            context = Path.parse(behaviour.context);
                            if(context.last() === gaffa.pathWildcard){
                                context.pop();
                                if(modelChangeEvent.target.toRawString().indexOf(context.toRawString()) === 0){
                                    context.push(modelChangeEvent.target[context.length]);
                                }
                            }else{
                                context = Path.parse(behaviour.path);
                            }
                        }
                        var throttleTime = behaviour.throttle;
                        if(!isNaN(throttleTime)){
                            var now = new Date();
                            if(!behaviour.lastTrigger || now - behaviour.lastTrigger > throttleTime){
                                behaviour.lastTrigger = now;
                                executeBehaviour(behaviour, context);
                            }else{
                                clearTimeout(behaviour.timeout);
                                behaviour.timeout = setTimeout(function(){
                                        behaviour.lastTrigger = now;
                                        executeBehaviour(behaviour, context);
                                    },
                                    throttleTime - (now - behaviour.lastTrigger)
                                );
                            }
                        }else{
                            executeBehaviour(behaviour, context);
                        }
                    });
                },
                                
                interval: function(behaviour){
                    internalIntervals.push(setInterval(function(){
                        gaffa.actions.trigger(behaviour.actions, behaviour.path);
                    },behaviour.time || 5000)); //If you forget to set the interval, we will be nice and give you 5 seconds of debug time by default, rather than 0ms looping you to death.
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
                                if(property.value == null){
                                    property.value = "";
                                }
                                property.value = convertDateToString(property.value).toString();
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
                
                collection: function (propertyName, insert, remove, empty) {
                    return function (viewModel, firstRun) {
                        var property = viewModel.properties[propertyName],
                            sort = property.sort,
                            valueLength = 0,
                            childViews = viewModel.viewContainers[propertyName],
                            value = property.value,
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
                                    var childView = childViews[i];
                                    if(!value[childView.key]){
                                        childViews.splice(i, 1);
                                        i--;
                                        remove(viewModel, value, childView);
                                    }
                                }
                                
                                //Add items which do not exist in the dom
                                for (var key in value) {
                                    if(Array.isArray(value) && isNaN(key)){
                                        continue;
                                    }
                                    
                                    isEmpty = false;
                                    
                                    var existingChildView = false;
                                    for(var i = 0; i < childViews.length; i++){
                                        var child = childViews[i];
                                        if(child.key === key){
                                            existingChildView = child;
                                        }
                                    }
                                    
                                    if (!existingChildView) {
                                        newView = {key: key};
                                        insert(viewModel, value, newView);
                                    }
                                }
                                
                                empty(viewModel, isEmpty);
                                    
                                if(sort && !isEmpty){
                                                                
                                    childViews.sort(function(a,b){
                                    
                                        //Im hyjacking the fact that sort hits every childView
                                        //to reset the isRendered flag. I could run a loop before this that
                                        //reset it but this cuts down on a loop...
                                        b.isRendered = false;
                                        
                                        return gaffa.utils.getProp(value[a.key], sort) - gaffa.utils.getProp(value[b.key], sort);
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
                
                group: function (propertyName, insert, remove, empty) {
                    return function (viewModel, firstRun) {
                        var property = viewModel.properties[propertyName],
                            value = property.value,
                            childViews = viewModel.viewContainers[propertyName],
                            newView,
                            isEmpty;
                        
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
                                                        
                            isEmpty = !childViews.length;
                                                        
                            empty(viewModel, isEmpty);
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
                    history.pushState(app, title, document.location);
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
                        return $.extend(true, {}, value);
                    }
                }
                return value;
            }

        };

        return new innerGaffa();

    }
})();
