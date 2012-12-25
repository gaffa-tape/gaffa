//Copyright (C) 2012 Kory Nunn, Matt Ginty & Maurice Butler

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (undefined) {
    "use strict";

    //Create gaffa
    var gedi = window.gedi,
        gaffa = window.gaffa = {},
        history = window.History || window.history; //Allow custom history implementations if defined.
        
    // Gedi Specs.
    var Path = gedi.Path,
        Expression = gedi.Expression;
    

    //"constants"
    gaffa.pathSeparator = "/";
    gaffa.upALevel =  "..";
    gaffa.relativePath = "~";
    gaffa.pathStart = "[";
    gaffa.pathEnd = "]";
    gaffa.pathWildcard = "*";
    
    //internal varaibles
    
        // Storage for the applications model 
    var internalModel = gedi.get(),
    
        // Storage for the applications view.
        internalViewModels = [],
        
        // Storage for application global events.
        internalActions = {},
        
        // Storage for application notifications
        internalNotifications = {},
        
        // Storage for interval based behaviours
        internalIntervals = [],
        
        // Storage for applications default styles
        defaultViewStyles;

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
        
        !parent && (parent = Object);
        
        !parent.prototype && (parent.prototype = {});
        
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
    
        while(internalIntervals.length){
            clearInterval(internalIntervals.pop());
        }

        //clear state first
        if (app.views) {
            gaffa.views.remove();
        }
        if (app.model) {
            gedi.set({});
        }
        
        //set up state
        if (app.model) {
            gaffa.model.set(app.model, null, null, false);
        }
        if (app.views) {
            gaffa.views.add(app.views);
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
    //      Insert View
    //
    //***********************************************

    function insertView(viewModel, renderTarget, appendFunction, index) {
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
            for (var key in viewModel.views) {
                viewModel.views[key].fastEach(function (childViewModel) {
                    insertView(childViewModel, viewModel.views[key].element);
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

    //***********************************************
    //
    //      Trigger Action
    //
    //***********************************************

    function triggerAction(action) {        
        action.trigger();
    }
    

    //***********************************************
    //
    //      Bind Property
    //
    //***********************************************

    function bindProperty(viewModel) {
        var property = this,
            absoluteViewPath = viewModel.getPath(),
            updateProperty = function () {
                if(property.binding.original){
                    property.value = gedi.get(property.binding, absoluteViewPath);                    
                }                    
                if(property.update){
                    property.update.call(viewModel);
                }
            };
        
        this.binding = new Expression(this.binding);
        this.binding.paths.fastEach(function(path){            
            gaffa.model.bind(absoluteViewPath.append(path), updateProperty)
        });
        updateProperty();
    }

    
    //***********************************************
    //
    //      Insert Function
    //
    //***********************************************
    
    function insertFunction(selector, renderedElement){
        $(selector).append(renderedElement);
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
        
        var result = new Path();
        
        paths.reverse().fastEach(function(path){
            result = result.append(path);
        });
        
        return result;
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
                                                            
                if(typeof sourceProperty === "object" && sourceProperty != null){
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
    //      Initialise Action
    //
    //***********************************************
    
    function initialiseViewItem(viewItem, parentViewItem, spec) {
        //if the viewModel is an array, recurse.
        var newViewItem = viewItem,
            specCollection;
        
        if (spec === Action){
           specCollection = gaffa.actions;
        }else if(spec === View){
           specCollection = gaffa.views;        
        }else if(spec === Behaviour){
           specCollection = gaffa.behaviours;        
        }
        
        if(!(viewItem instanceof spec)){        
            if (!specCollection[viewItem.type]) {
                console.error("No action is loaded to handle view of type " + viewItem.type);
            }
            
            newViewItem = new specCollection[viewItem.type]();
            
            newViewItem.path = Path.parse(viewItem.path);
        
            extend(newViewItem, viewItem);
        }
        
        for(var key in newViewItem.views){
            if(!(newViewItem.views[key] instanceof ViewContainer)){
                newViewItem.views[key] = new ViewContainer(newViewItem.views[key]);
            }
            newViewItem.views[key].fastEach(function(view, index, views){
                views[index] = initialiseViewItem(view, newViewItem, View);
            });
        }
        
        for(var key in newViewItem.actions){
            newViewItem.actions[key].fastEach(function(action, index, actions){
                actions[index] = initialiseViewItem(action, newViewItem, Action);
            });
        }
        
        
        newViewItem.parent = parentViewItem;
        
        return newViewItem;
    }
    
    //***********************************************
    //
    //      Initialise View
    //
    //***********************************************
    
    function initialiseView(viewModel, parentView) {        
        return initialiseViewItem(viewModel, parentView, View);
    }
    
    
    //***********************************************
    //
    //      Add View
    //
    //***********************************************
    
    function addView(viewModel, parentView, parentViewChildArray, index, addInPlace) {
        //if the viewModel is an array, recurse.
        if (viewModel instanceof Array) {
            viewModel.fastEach(function (viewModel, index, viewModels) {
                addView(viewModel, parentView, viewModels, index, true);
            });
            return;
        }
        
        viewModel = initialiseView(viewModel, parentView);
            
        if (parentView && parentViewChildArray) {
            if(index != null){
                if(addInPlace){
                    parentViewChildArray[index] = viewModel;
                }else{
                    parentViewChildArray.splice(index, 0, viewModel);
                }
            }else{
                parentViewChildArray.push(viewModel);
            }
        } else {
            internalViewModels.push(viewModel);
        }
        
        viewModel.render();
        viewModel.bind();
        viewModel.insert(parentViewChildArray);
                
        return viewModel;
    }
    
    
    //***********************************************
    //
    //      Remove Views
    //
    //***********************************************    
    
    function removeViews(views){
        if(!views){
            views = internalViewModels;
        }
        
        views.fastEach(function(viewModel){
            viewModel.remove();
        });
    }

    
    //Public Objects ******************************************************************************
    
    //***********************************************
    //
    //      Property Object
    //
    //***********************************************
    
    function Property(updateFunction){
        this.update = updateFunction;
    }
    Property = createSpec(Property); 
    Property.prototype.bind = bindProperty;
    Property.prototype.getPath = getViewItemPath;
    
    
    //***********************************************
    //
    //      View Container Object
    //
    //***********************************************
    
    function ViewContainer(viewContainerDescription){
        var viewContainer = this;
        viewContainerDescription instanceof Array && viewContainerDescription.fastEach(function(childView){
            viewContainer.push(childView);
        });
        
        this.render = new Property(this.render || {value:true});
        this.render.update = function(viewModel){
            
        };
    }
    ViewContainer = createSpec(ViewContainer, Array); 
    ViewContainer.prototype.bind = function(parent){
        this.parent = parent;
        return this;
    };
    ViewContainer.prototype.getPath = getViewItemPath;
    ViewContainer.prototype.add = function(viewModel){
    
        // If this has a parent (it has been bound)
        // call addView, which binds and renderes the
        // inserted views.
        if(this.parent){
            addView(viewModel, this.parent, this);
        }else{
        
        // Otherwise, just push the viewModel into the
        // ViewContainer, to be bound when the parent
        // ViewItem is bound.
            this.push(viewModel);
        }
        return this;
    };
    
    
    //***********************************************
    //
    //      ViewItem Object
    //
    //***********************************************
    
    function ViewItem(){
        //console.log('ViewItem constructor for ' + this.constructor.name);
        
        for(var key in this){
            if(this[key] instanceof Property){
                this[key] = new Property(this[key].update);
            }
        }
        
        this.actions = {};
        
        this.path = "[~]";
    }
    ViewItem = createSpec(ViewItem);
    ViewItem.prototype.bind = function(){
        for(var eventKey in this.actions){
            var viewModel = this;
            this.actions[eventKey].fastEach(function(action, index, actions){
                var action = actions[index];
                
                action.eventKey = eventKey;
                action.bind();
            });
        }
        
        for(var propertyKey in this){
            if(this[propertyKey] instanceof Property){
                this[propertyKey].bind(this);
            }
        }
    };
    ViewItem.prototype.detach = function(){
        $(this.renderedElement).detach()
    };
    ViewItem.prototype.remove = function(){
        this.detach();
        //remove handlers and such...
    };
    ViewItem.prototype.getPath = getViewItemPath;
    
    //***********************************************
    //
    //      View Object
    //
    //***********************************************
    
    function View(viewDescription){}
    View = createSpec(View, ViewItem);          
    View.prototype.bind = function(){
        ViewItem.prototype.bind.apply(this, arguments);
        this.forEachChild(function(){
            this.bind();
        });
    };
    View.prototype.render = function(){
        this.renderedElement.viewModel = this;
        this.forEachChild(function(){
            this.render();
        });
    };    
    View.prototype.insert = function(viewContainer){        
        var renderTarget = this.renderTarget || viewContainer && viewContainer.element || gaffa.views.renderTarget || 'body';
        this.insertFunction(this.insertSelector || renderTarget, this.renderedElement);
        this.forEachChild(function(viewContainer){
            this.insert(viewContainer);
        });
    };    
    View.prototype.classes = new Property(function(){
        var viewModel = this,
            property = viewModel.classes,
            internalClassNames = viewModel.renderedElement.internalClassNames = viewModel.renderedElement.internalClassNames || $(viewModel.renderedElement).attr("class") || "";
            
        $(viewModel.renderedElement).attr("class", internalClassNames + " " + (property.value || ""));            
    });
    View.prototype.forEachChild = function(callback){
        for(var key in this.views){
            var parentView = this;
            this.views[key].fastEach(function(view){
                callback.call(view, parentView.views[key]);
            });
        }
    };
    View.prototype.visible = new Property(function() {
        var viewModel = this,
            value = viewModel.visible.value;
            
        if (value === false) {
            $(viewModel.renderedElement).css("display", "none");
        } else {
            $(viewModel.renderedElement).css("display", "");            
        }
    });
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
    
    //***********************************************
    //
    //      Action Object
    //
    //***********************************************
    
    function Action(actionDescription){
    }
    Action = createSpec(Action, ViewItem);
    Action.prototype.bind = function(){
        ViewItem.prototype.bind.apply(this, arguments);
        var action = this;
        if (!action.bound) {
            $(action.parent.renderedElement).on(action.eventKey, function (event) {
                action.trigger();
            });
            action.bound = true;
        }
    };
    
    //***********************************************
    //
    //      Behaviour Object
    //
    //***********************************************
    
    function Behaviour(behaviourDescription){}
    Behaviour = createSpec(Behaviour, ViewItem);
    Behaviour.prototype.bind = function(){   
        ViewItem.prototype.bind.apply(this, arguments);  
        
        this.path = Path.parse(this.path);
    };
    
    //***********************************************
    //
    //      Page Load Behaviour
    //
    //*********************************************** 
    
    function PageLoadBehaviour(){}
    PageLoadBehaviour = createSpec(PageLoadBehaviour, Behaviour);
    PageLoadBehaviour.prototype.bind = function(){
        Behaviour.prototype.bind.apply(this, arguments);
        
        gaffa.actions.trigger(this.actions.load, this);        
    };
    
    function ModelChangeBehaviour(){}
    ModelChangeBehaviour = createSpec(ModelChangeBehaviour, Behaviour);
    ModelChangeBehaviour.prototype.bind = function(){
        Behaviour.prototype.bind.apply(this, arguments);
        
        var behaviour = this;
        
        function executeBehaviour(behaviour, context){
            var currentValue = JSON.stringify(gedi.get(behaviour.path));
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
    };
                
    
    function IntervalBehaviour(){}
    IntervalBehaviour = createSpec(IntervalBehaviour, Behaviour);
    IntervalBehaviour.prototype.bind = function(){  
        Behaviour.prototype.bind.apply(this, arguments);

        internalIntervals.push(setInterval(function(){
            gaffa.actions.trigger(this.actions, this.path);
        },this.time || 5000)); //If you forget to set the interval, we will be nice and give you 5 seconds of debug time by default, rather than 0ms looping you to death.
    };

    //***********************************************
    //
    //      Gaffa object.
    //
    //***********************************************

    extend(gaffa, {
        addDefaultStyle: addDefaultStyle,
        createSpec: createSpec,
        Path: gedi.Path,
        Expression: gedi.Expression,
        ViewItem: ViewItem,
        View: View,
        ContainerView: ContainerView,
        Action: Action,
        Property: Property,
        ViewContainer: ViewContainer,
        model: {
            get:gedi.get,
            set:function(path, value, viewItem, dirty) {
                if(Path.mightParse(path) && viewItem){
                    path = viewItem.getPath().append(path);
                }
                
                gedi.set(path, value);
            },
            bind: gedi.bind
        },
        views: {
            insertTarget: null,
            
            //Add a view or viewModels to another view, or the root list of viewModels if a parent isnt passed.
            //Set up the viewModels bindings as they are added.
            add: addView,
            
            remove: removeViews
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
                actions instanceof Array && actions.fastEach(triggerAction);
            }
        },

        behaviours: {
            add: function (behaviours) {
                //if the views isnt an array, make it one.
                if (behaviours && !behaviours.length) {
                    behaviours = [behaviours];
                }

                behaviours.fastEach(function (behaviour, index, behaviours) {
                
                    behaviour = behaviours[index] = initialiseViewItem(behaviour, null, Behaviour);
                    
                    behaviour.bind();
                });
            },
            
            pageLoad: PageLoadBehaviour,
            
            modelChange: ModelChangeBehaviour,
                            
            interval: IntervalBehaviour
        },

        utils: {
            get: gedi.utils.get,
            
            set: gedi.utils.set,
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
                    return function () {
                        var viewModel = this,
                            property = viewModel[propertyName],
                            element = viewModel.renderedElement,
                            convertDateToString = function (date){
                                if(date && date instanceof Date && typeof gaffa.dateFormatter === "function"){
                                    return gaffa.dateFormatter(date);
                                }else{
                                    return date;
                                }
                            };
                            
                        if (property.value !==  property.previousValue) {
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
                    return function () {
                        var viewModel = this,
                            property = viewModel[propertyName],
                            value = property.value,
                            element = viewModel.renderedElement;
                        
                        if (property.previousValue !== value) {
                            property.previousValue = value;
                            if (element) {
                                callback(viewModel, value);
                            }
                        }
                    };
                }
            },
            
            collection: function (propertyName, insert, remove, empty) {
                return function () {
                    var viewModel = this,
                        property = viewModel[propertyName],
                        sort = property.sort,
                        valueLength = 0,
                        childViews = viewModel.views[propertyName],
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
                return function () {
                    var viewModel = this,
                        property = viewModel[propertyName],
                        value = property.value,
                        childViews = viewModel.views[propertyName],
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
                    return function () {
                        var viewModel = this,
                            property = viewModel[propertyName],
                            value = property.value;
                        if (property.previousValue !== value) {
                            property.previousValue = value;
                            callback(viewModel, property.value);
                        }
                    };
                }
            },
            
            // ToDo: I dont like this...
            object: function (propertyName, callback) {
                return function () {
                    var viewModel = this,
                        property = viewModel[propertyName],
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

    });
})();
