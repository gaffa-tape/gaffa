//Copyright (C) 2012 Kory Nunn & Matt Ginty

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

    //internal varaibles
    var internalModel = {},
    //these must always be instantiated.
        internalViewModels = [],

        internalBindings = [],


        memoisedModel = {},


        operatorRegex = /(!=)|(===)|(==)|(\|\|)|(>)|(<)|(>=)|(<=)|(&&)|(%)/;

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
    //      String Get Nesting
    //
    //***********************************************

    String.prototype.getNesting = function (startTag, endTag) {

        var matchStartTag = new RegExp(startTag.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")), /// Comment to fix chrome web inspector
            matchEndTag = new RegExp(endTag.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")), /// Comment to fix chrome web inspector
            contents = [],
            startMatchIndex = (matchStartTag.exec(this) || { index: -1 }).index,
            hasStart = startMatchIndex >= 0,
            endMatchIndex = (matchEndTag.exec(this) || { index: -1 }).index,
            hasEnd = endMatchIndex >= 0,
            tag,
            groups = 0,
            currentString = "",
            restOfString = this,
            currentIndex = 0,
            openIndex,
            closeIndex;

        while ((hasStart || hasEnd) && restOfString) {
            tag = "";

            if (hasStart && hasEnd && startMatchIndex < endMatchIndex) {
                tag = startTag;
                currentIndex = startMatchIndex;
                if (groups == 0) {
                    openIndex = currentIndex;
                }
                groups++;

            } else if (hasStart) {
                throw "Could not parse nesting, bad formatting.";
            } else if (hasEnd) {
                tag = endTag;
                currentIndex = endMatchIndex;
                groups--;
                if (groups == 0) {
                    closeIndex = currentIndex + currentString.length;
                }
            }

            currentString += restOfString.slice(0, currentIndex + tag.length);
            restOfString = restOfString.slice(currentIndex + tag.length, this.length);

            startMatchIndex = (matchStartTag.exec(restOfString) || { index: -1 }).index;
            hasStart = startMatchIndex >= 0;
            endMatchIndex = (matchEndTag.exec(restOfString) || { index: -1 }).index;
            hasEnd = endMatchIndex >= 0;
        }

        var startString = this.slice(0, openIndex);

        if (startString) {
            contents.push(startString);
        }
        if (openIndex !== undefined && closeIndex !== undefined && openIndex < closeIndex) {
            contents.push(this.slice(openIndex + startTag.length, closeIndex).getNesting(startTag, endTag));
        }
        if (openIndex !== undefined && closeIndex !== undefined && restOfString !== "") {
            contents.push(restOfString);
        }

        return contents;

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
                    gaffa.model.set(key, value);
                }else{
                    gaffa.model.set(key, null);
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
            var newModel = gaffa.extend(true, {}, app.model, model);
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
            
            var keys = gaffa.paths.stripUpALevels(path).split(gaffa.pathSeparator),
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
    
        //passed an array binding, take the first as default.
        //this would happen if an array was used as a binding without a format string
        if (path.isArray) {
            path = path[0];
        }

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

        var keys = gaffa.paths.stripUpALevels(path).split(gaffa.pathSeparator),
            reference = model,
            triggerStack = [];

        keys.fastEach(function (key, index, keys) {

            var binding;
            
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
                binding = keys.join("_");
                triggerStack.push(binding);
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];

                //Report to things looking for all changes below here.
                binding = keys.slice(0, index + 1).join("_");
                triggerStack.push(binding);
            }
        });

        memoisedModel[model] = {};

        //IMA FIREIN MA CHANGEZOR!.
        var finalPath = keys.join(gaffa.pathSeparator);
        gaffa.model.trigger(finalPath, gaffa.model.get(finalPath));

        triggerStack.reverse().fastEach(function (binding) {
            gaffa.model.trigger(binding, gaffa.model.get(binding));
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
        if (path.isArray) {
            path = path[0];
        }

        var keys = gaffa.paths.stripUpALevels(path).split(gaffa.pathSeparator),
            reference = model,
            triggerStack = [];

        //handle "Up A Level"s in the path.
        //yeah yeah, its done differently up above...
        //ToDo: refactor.

        keys.fastEach(function (key, index, keys) {

            var binding;

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
                binding = keys.join("_");
                triggerStack.push(binding);
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];

                //Report to things looking for all changes below here.
                binding = keys.slice(0, index + 1).join("_");
                triggerStack.push(binding);
            }
        });

        memoisedModel[model] = {};

        //IMA FIREIN MA CHANGEZOR!.
        triggerStack.reverse().fastEach(function (binding) {
            gaffa.model.trigger(binding, gaffa.model.get(binding));
        });
    }

    //***********************************************
    //
    //      Trigger Binding
    //
    //***********************************************

    function triggerBinding(binding, value) {
        var keys = gaffa.paths.stripUpALevels(binding).split(gaffa.pathSeparator),
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
                callback(value);
            });

            for (var key in reference) {
                if (reference.hasOwnProperty(key) && reference[key].isArray) {
                
                    //un-excape underscored array properties.
                    if (key.indexOf("_") === 0 && (!isNaN(key.substr(1))||[].hasOwnProperty(key.substr(1)))) {
                        key = key.substr(1);
                    }
                    if (value !== undefined && value !== null) {
                        triggerBinding(keys.join(gaffa.pathSeparator) + gaffa.pathSeparator + key, value[key]);
                    } else {
                        triggerBinding(keys.join(gaffa.pathSeparator) + gaffa.pathSeparator + key, undefined);
                    }
                }
            }
        }
    }

    //***********************************************
    //
    //      Set Binding
    //
    //***********************************************

    function setBinding(binding, callback) {
    
        //If the binding has opperators in it, break them apart and set them individually.
        var bindingParts = binding.split(operatorRegex);
        if (bindingParts.length > 1) {
            bindingParts.fastEach(function (value) {
                if (value && !value.match(operatorRegex) && value.indexOf("$") != 0) {
                    setBinding(value, callback);
                }
            });
            return;
        }

        var keys = gaffa.paths.stripUpALevels(binding).split(gaffa.pathSeparator),
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

    function renderView(viewModel, parent, appendFunction) {
        //un-comment to delegate rendering to happen as soon as possible, but not if it blocks the UI.
        //this will cause all kinds of hilariously stupid layout if you breakpoint during the render loop.
        //setTimeout(function () {
        if (viewModel.type === undefined && viewModel.text !== undefined) {
            viewModel.type = "html";
            viewModel.properties = {
                html: { value: viewModel.text }
            };
        }

        //Check if a renderer for the view type is loaded.
        if (gaffa.views[viewModel.type] !== undefined) {
            //it is, so render it.
            gaffa.views[viewModel.type].render(viewModel);
            
            // if a parent has been passed (for appending into)
            // Only append if it hasnt got a parent already
            // ToDo: make this bettera maybe.
            if(!viewModel.isRendered){
                viewModel.isRendered = true;
                if (viewModel.insertSelector && typeof viewModel.insertFunction === "function"){
                    viewModel.insertFunction(viewModel.insertSelector, viewModel.renderedElement);
                }else if (parent) {
                    //A custom append function can also be passed to handle non-html elements like SVG etc.
                    if (appendFunction) {
                        appendFunction(parent, viewModel.renderedElement);
                    } else {
                        parent.appendChild(viewModel.renderedElement);
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
                                gaffa.actions.trigger(action, viewModel.binding);
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
    //      Bind Action
    //
    //***********************************************

    //mostly just make sure all the relative bindings are made absolute. delegate actions to the appropriate action object.
    //ToDo: make actions more like views so bindings work better.
    function bindAction(action, parentBinding) {

        action.binding = action.binding || parentBinding;
        action.binding = gaffa.paths.getAbsolutePath(parentBinding, action.binding);

        for (var key in action.bindings) {
            var binding = action.bindings[key];
            if (binding && action.bindings[key].binding !== undefined) {   
                if (binding.binding.isArray) {
                    binding.binding.fastEach(function (path, index) {
                        binding.binding[index] = gaffa.paths.getAbsolutePath(parentBinding, path);
                        binding.value = binding.value||[];
                        binding.value[index] = gaffa.model.get(binding.binding[index]); 
                    });
                }else{      
                    binding.binding = gaffa.paths.getAbsolutePath(parentBinding, binding.binding);
                    binding.value = gaffa.model.get(binding.binding);    
                }                
            }
        }
        if (typeof gaffa.actions[action.type] === "function") {
            gaffa.actions[action.type](action);
        }
    }

    //***********************************************
    //
    //      Bind Property
    //
    //***********************************************

    function bindProperty(viewModel, path, key, propertyBinding) {
        gaffa.model.bind(path, function (value) {
            if(typeof gaffa.views[viewModel.type].update[key] === "function"){
                gaffa.views[viewModel.type].update[key](viewModel, value, false, propertyBinding);
            }
        });
    }

    //***********************************************
    //
    //      Bind Properties
    //
    //***********************************************

    //ToDo: genericise this so it can be used for action properties when they get implemented.
    function bindProperties(viewModel, absolutePropertyBinding) {

        //bind each of the views properties to the model.
        for (var key in viewModel.properties) {
            var property = viewModel.properties[key];
            if (property && property.binding) {
                if (property.binding.isArray) {
                    property.binding.fastEach(function (path, index) {
                        property.binding[index] = gaffa.paths.getAbsolutePath((absolutePropertyBinding || viewModel.binding), path);
                    });
                } else {
                    property.binding = gaffa.paths.getAbsolutePath((absolutePropertyBinding || viewModel.binding), property.binding);
                }

                // this function is to create a closure so that 'key' is still the same key when the event fires.
                (function (key, property) {
                    if (property.filter) {
                        
                        var filterExpression = property.filter.getNesting("(",")"),
                        bindFilterPaths = function(expression){
                            if(expression.isArray){
                                expression.fastEach(function(child){
                                    bindFilterPaths(child);
                                });
                            }else{
                                expression = expression.replace(/\s/g, "");
                                var parts = expression.split(operatorRegex);
                                parts.fastEach(function(part){
                                    if(part && getPartType(part) === "path"){                                        
                                        gaffa.model.bind(part, function () {
                                            if(typeof gaffa.views[viewModel.type].update[key] === "function"){
                                                gaffa.views[viewModel.type].update[key](viewModel, gaffa.model.get(property.binding));
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        
                        bindFilterPaths(filterExpression);
                        
                    }
                    if (property.binding) {
                        if (property.binding.isArray) {
                            property.binding.fastEach(function (path, index) {
                                if (!(property.value && property.value.isArray)) {
                                    viewModel.properties[key].value = [];
                                }
                                property.value[index] = gaffa.model.get(property.binding[index]);
                                bindProperty(viewModel, property.binding[index], key, index);
                            });
                        } else {
                            property.value = gaffa.model.get(property.binding);
                            bindProperty(viewModel, property.binding, key);
                        }
                    }
                })(key, property);
            }
        }
    }

    //***********************************************
    //
    //      Bind View
    //
    //***********************************************

    //gaffa together view properties to model properties.
    function bindView(viewModel, parentView, propertyBinding) {

        var parentViewBinding = "",
            absolutePropertyBinding = "";

        // Check if a view is loaded to handle the passed in view.
        if (viewModel && viewModel.type) {
            if (gaffa.views[viewModel.type] === undefined) {
                console.error("No view loaded to handle views of type: " + viewModel.type + ", Are you missing a script reference?");
                return;
            }
        } else if(viewModel.text === undefined) {
            console.error("Invalid viewModel. Object contains no 'type' property");
            return;
        } else{
            return;
        }

        //ToDo: probs a better way to do this....
        //Extend the passed in settings with defaults
        gaffa.extend(true, viewModel, gaffa.extend({}, gaffa.views[viewModel.type].defaults, viewModel));

        if (parentView) {
            parentViewBinding = parentView.binding;
            absolutePropertyBinding = gaffa.paths.getAbsolutePath(parentViewBinding, viewModel.binding);
            if (propertyBinding !== undefined) {
                absolutePropertyBinding = gaffa.paths.getAbsolutePath(gaffa.paths.getAbsolutePath(parentViewBinding, propertyBinding), viewModel.binding);
            }
            viewModel.binding = absolutePropertyBinding;
        } else {
            if (viewModel.binding.indexOf(gaffa.relativePath) >= 0) {
                viewModel.binding = parentViewBinding;
            }
        }

        bindProperties(viewModel, viewModel.binding);

        //recursivly bind child views.
        for (var viewKey in viewModel.views) {
            viewModel.views[viewKey].fastEach(function (childViewModel) {
                bindView(childViewModel, viewModel);
            });
        }
    }
    
    function getPartType(part){
        if (part.indexOf("$") === 0) {
            return "$";
        } else if(part.indexOf("#") === 0){
            return "#";
        }else {
            return "path";
        }
    }

    //***********************************************
    //
    //      Parse Expression
    //
    //***********************************************

    function parseExpression(expression, model) {
        var matches = {
            "!=": { regex: /(!=)/, func: function (a, b) { return a != b; } },
            "===": { regex: /(===)/, func: function (a, b) { return a === b; } },
            "==": { regex: /(==)/, func: function (a, b) { return a == b; } },
            ">": { regex: /(>)/, func: function (a, b) { return a > b; } },
            "<": { regex: /(<)/, func: function (a, b) { return a < b; } },
            ">=": { regex: /(>=)/, func: function (a, b) { return a >= b; } },
            "<=": { regex: /(<=)/, func: function (a, b) { return a <= b; } },
            "||": { regex: /(\|\|)/, func: function (a, b) { return a || b; } },
            "&&": { regex: /(\&\&)/, func: function (a, b) { return a && b; } },
            "%": { regex: /(%)/, func: function (a, b) { return (typeof(a) === "string" && typeof(b) === "string" && a.toLowerCase().indexOf(b.toLowerCase())>=0) === true; } }
        },
            expressionParts = [],
            result;

        if (typeof expression === "string") {
            var parts = expression.split(operatorRegex);
            parts.fastEach(function (part) {
                if (part !== undefined && part !== "") {
                    if (part.match(operatorRegex)) {
                        expressionParts.push(part);
                    } else {
                        var value,
                            partType = getPartType(part);
                            
                        if (partType === "$") {
                            value = part.slice(1, part.length);
                        } else if(partType === "#"){
                            value = parseFloat(part.slice(1, part.length));
                        }else if(partType === "path"){
                            value = get(part, model);
                        }
                        if (value == undefined) {
                            value = "";
                        }
                        expressionParts.push(value);
                    }
                }
            });
        } else if (expression.isArray) {
            var part;
            expression.fastEach(function (value, index) {
                part = parseExpression(value, model);
                if (part.isExpressionParts) {
                    expressionParts = expressionParts.concat(part);
                } else {
                    expressionParts.push(part);
                }
            });
        }
        if (expressionParts.length > 2) {
            result = matches[expressionParts[1]].func(expressionParts[0], expressionParts[2]);
            for (var i = 3; i < expressionParts.length; i += 3) {
                if (expressionParts.length > i + 1) {
                    result = matches[expressionParts[i]].func(result, expressionParts[i + 1]);
                } else {
                    var partsToReturn = [result, expressionParts[i]];
                    partsToReturn.isExpressionParts = true;
                    return partsToReturn;
                }
            }
            return result;
        } else {
            return expressionParts[0];
        }
    }
    function insertView(selector, renderedElement){
        $(selector).append(renderedElement);
    }

    //Public Objects ******************************************************************************

    //***********************************************
    //
    //      View Object NOT CURRENTLY IN USE!!!!!
    //
    //***********************************************

    function view() {

    }

    view.Prototype = {
        render: function (viewModel) {
            //only render if the view has not previously been rendered.                            
            if (viewModel.renderedElement) {
                return;
            }

            //extend the passed in view with default options for that view type.
            gaffa.extend(true, viewModel, defaults, viewModel);

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
                if (value) {
                    $(viewModel.renderedElement).css("display", "");
                } else {
                    $(viewModel.renderedElement).css("display", "none");
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

        binding: gaffa.relativePath,

        properties: {
            visible: { value: true },

            classes: {}
        },

        isView: true
    };
    
    function path(path){
        this.path = path;
    };

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
                getAbsolutePath: function (parentBinding, childBinding) {
                    if (childBinding.indexOf(gaffa.relativePath) === 0) {
                        childBinding = childBinding.replace(gaffa.relativePath, "");
                        if (childBinding === "") {
                            return parentBinding;
                        }
                        return parentBinding + gaffa.pathSeparator + childBinding;
                    }
                    else {
                        return childBinding;
                    }
                },

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
                get: function (path) {
                    return get(path, internalModel);
                },

                set: function (path, value) {
                    set(path, value, internalModel);
                },
                
                remove: function (path) {
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
                        viewModels.fastEach(function (viewModel) {
                            renderView(viewModel, parent, appendFunction);
                        });
                    }

                    //if its just one view, just render it
                    else if (viewModels) {
                        renderView(viewModels, parent, appendFunction);
                    }

                    //if nothing is passed in, render ALL the viewModels!
                    else {
                        var renderTarget = this.renderTarget || document.getElementsByTagName('body')[0];
                        internalViewModels.fastEach(function (internalViewModel) {
                            renderView(internalViewModel, renderTarget, appendFunction);
                        });
                    }
                },

                //Add a view or viewModels to another view, or the root list of viewModels if a parent isnt passed.
                //Set up the viewModels bindings as they are added.
                add: function (viewModels, parentView, parentViewChildArray, propertyBinding) {
                    //if the viewModels isnt an array, make it one.
                    if (viewModels && !viewModels.length) {
                        viewModels = [viewModels];
                    }

                    viewModels.fastEach(function (viewModel) {
                        if (gaffa.views[viewModel.type] !== undefined) {
                            //if this view has a parent.
                            if (parentView && parentViewChildArray) {

                                //bind ALL the things!
                                bindView(viewModel, parentView, propertyBinding);

                                parentViewChildArray.push(viewModel);
                            }
                            //otherwise, this view should be in the root list of viewModels.
                            else {
                                bindView(viewModel);

                                internalViewModels.push(viewModel);
                            }
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
                            gaffa.views[viewModel.type].update[key](viewModel, viewModel.properties[key].value, true);
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
                            gaffa.extend(true, viewModel, defaults, viewModel);

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
                            binding: gaffa.relativePath,
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
                trigger: function (actions, parentBinding) {
                    actions.fastEach(function (action) {
                        bindAction(action, parentBinding);
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
                //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
                getProp: function (object, propertiesString) {
                    var properties = propertiesString.split(".").reverse();
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

                parseExpression: parseExpression
            },

            propertyUpdaters: {

                string: function (propertyName, callback, matchError) {
                    if (typeof propertyName === "object") {
                        //passed a property object, doing a set.
                        var propertyObject = propertyName,
                        string = callback;

                        if (propertyObject.binding.isArray && propertyObject.format) {
                            var inputValues = string.deformat(propertyObject.format);

                            if (!inputValues) {
                                if (matchError) {
                                    matchError();
                                }
                            } else {
                                inputValues.fastEach(function (value, index) {
                                    gaffa.model.set(propertyObject.binding[index], value);
                                });
                            }
                        } else {
                            gaffa.model.set(propertyObject.binding, string);
                        }
                    } else {
                        return function (viewModel, value, firstRun, index) {
                            var property = viewModel.properties[propertyName],
                                element = viewModel.renderedElement,
                                convertDateToString = function (date){
                                    if(date && date instanceof Date && typeof gaffa.dateFormatter === "function"){
                                        return gaffa.dateFormatter(date);
                                    }else{
                                        return date;
                                    }
                                }

                            index = parseInt(index);
                            if (value && value.isArray || !isNaN(index)) {
                                if (property.value[index] !== value || firstRun) {
                                    property.value[index] = value;
                                    if (element) {
                                        var string;
                                        if(property.value && property.value.isArray){
                                            property.value.fastEach(function(subValue, index, values){
                                                values[index] = convertDateToString(subValue);
                                            });
                                            if (property.format && typeof property.format === "string") {
                                                string = property.format.format(property.value);
                                            } else {                                            
                                                string = property.value.join("");
                                            }
                                        }else{
                                            string = convertDateToString(property.value);
                                        }
                                        
                                        callback(viewModel, string);
                                    }
                                }
                            } else {
                                if (property.value !== value || firstRun) {
                                    value = convertDateToString(value);
                                    property.value = value;
                                    if (element) {
                                        callback(viewModel, value);
                                    }
                                }

                            }
                        };
                    }
                },
                
                number: function (propertyName, callback, matchError) {
                    if (typeof propertyName === "object") {
                        //passed a property object, doing a set.
                        var propertyObject = propertyName,
                        string = callback;

                        gaffa.model.set(propertyObject.binding, string);
                        
                    } else {
                        return function (viewModel, value, firstRun) {
                            var property = viewModel.properties[propertyName],
                                element = viewModel.renderedElement;
                            
                            if (property.value !== value || firstRun) {
                                property.value = value;
                                if (element) {
                                    callback(viewModel, value);
                                }
                            }
                        };
                    }
                },
                
                collection: function (propertyName, insert, remove) {
                    return function (viewModel, value, firstRun) {
                        var property = viewModel.properties[propertyName],
                            valueLength = 0,
                            previousLength = property.previousLength || 0,
                            childViews = viewModel.viewContainers[propertyName],
                            calculateValueLength = function(){
                                if(value.isArray){
                                    return value.length;
                                }else if(typeof value === "object"){
                                    return Object.keys(value).length;
                                }
                            }
                            
                        if (value && typeof value === "object"){
                            var filtered,
                                pathSeperator = gaffa.pathSeparator;
                            
                            if(property.filter){                                        
                                if(value.isArray){
                                    filtered = [];
                                }else{
                                    filtered = {};
                                }
                                for(var key in value){
                                    if(value.isArray && isNaN(key)){
                                        continue;
                                    }
                                    var item = value[key];
                                    var filter = property.filter.replace(/~/, [property.binding, pathSeperator, key, pathSeperator].join(""));
                                    if(parseExpression(filter.getNesting("(", ")"), internalModel)){
                                        filtered[key] = item;
                                    }
                                };
                                property.value = filtered;
                            }else{
                                property.value = value;
                            }
                            
                            if(value.isArray && isNaN(key)){
                                property.previousLength = property.value.length;
                            }else{
                                property.previousLength = Object.keys(property.value).length;
                            }
                            
                            value = filtered || value;
                            
                            valueLength = calculateValueLength();
                        
                            if (valueLength !== previousLength || firstRun || filtered) {

                                var element = viewModel.renderedElement;
                                if (element && property.template) {
                                    var newView;
                                    
                                    for(var i = 0; i < childViews.length; i++){
                                        var childView = childViews[i];
                                        if(!value[childView.key]){
                                            childViews.splice(i, 1);
                                            i--;
                                            remove(viewModel, value, childView);
                                        }
                                    }
                                    
                                    for (var key in value) {
                                        if(value.isArray && isNaN(key)){
                                            continue;
                                        }
                                        var exists = false;
                                        childViews.fastEach(function(child){
                                            if(child.key === key){
                                                exists = true;
                                            }    
                                        });
                                        
                                        if (!exists) {
                                            newView = {key: key};
                                            insert(viewModel, value, newView);
                                        }
                                    }                                    
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
                    return function (viewModel, value, firstRun) {
                        var property = viewModel.properties[propertyName],
                            childViews = viewModel.viewContainers[propertyName],
                            newView;
                                    
                        property.value = value;
                        
                        if (value && typeof value === "object"){
                            
                            viewModel.distinctGroups = getDistinctGroups(property.value, property.group);
                            
                            for(var i = 0; i < childViews.length; i++){
                                var childView = childViews[i];
                                if(viewModel.distinctGroups.indexOf(childView.key)<0){
                                    childViews.splice(i, 1);
                                    i--;
                                    remove(viewModel, value, childView);
                                }
                            }
                            
                            viewModel.distinctGroups.fastEach(function(group){
                                var exists = false;
                                childViews.fastEach(function(child){
                                    if(child.key === group){
                                        exists = true;
                                    }    
                                });
                                
                                if (!exists) {
                                    newView = {key: group};
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

                bool: function (propertyName, callback) {
                    return function (viewModel, value, firstRun) {
                        var property = viewModel.properties[propertyName];
                        if (property.previousValue !== value || firstRun) {
                            property.previousValue = value;
                            if (typeof property.binding === "string") {
                                callback(viewModel, property.value = parseExpression(property.binding.getNesting("(", ")"), internalModel));
                            } else {
                                callback(viewModel, property.value);
                            }
                        } else if (value && value.length === 0) {
                            callback(viewModel, property.value = false);
                        }
                    };
                },
                
                // ToDo: I dont like this...
                object: function (propertyName, callback) {
                    return function (viewModel, value, firstRun) {
                        var property = viewModel.properties[propertyName];

                        property.value = value;
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
            extend: $.extend,
            
            clone: function(value){
                if(typeof value === "object"){
                    if(value.isArray){
                        return value.slice();
                    }else{
                        return gaffa.extend(true, {}, value);
                    }                    
                }else{
                    return value;
                }
            }

        };

        return new innerGaffa();
    }
})();