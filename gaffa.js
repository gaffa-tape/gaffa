(function(undefined) {

    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa();

    //"constants"
    // functions to make it 'getter only'
    gaffa.pathSeparator = function() {
        return "/";
    };
    gaffa.upALevel = function() {
        return "..";
    };
    gaffa.relativePath = function() {
        return "~";
    };


    //internal varaibles
    var internalmodel = {},
        //these must always be instantiated.
        internalViews = [];

    //internal functions
    
    
    /*
        Now I can detect arrays.
    */
    Array.prototype.isArray = true;

    //Lots of similarities between get and set, refactor later to reuse code.
    function get(path, model) {
        if (path) {
            var keys = path.split(gaffa.pathSeparator()),
                reference = model;

            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {

                //handle "Up A Level"s in the path.
                if (keys[keyIndex] === gaffa.upALevel()) {
                    keys.splice(Math.max(keyIndex - 1, 0), 2);
                    keyIndex--;

                }
                else {

/*  
                        if the thing at the current key in the model is an object
                        or an array (both typeof to object),
                        set it as the thing we want to look into next.
                    */
                    if (typeof reference[keys[keyIndex]] === "object") {
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
            }

            return reference;
        }
    }

    function set(path, value, model) {
        var keys = path.split(gaffa.pathSeparator()),
            reference = model,
            keyIndex,
            lastArrayLengthChange;

        //handle "Up A Level"s in the path.
        //yeah yeah, its done differently up above...
        //ToDo: refactor.
        for (keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            if (keys[keyIndex] === gaffa.upALevel()) {
                keys.splice(Math.max(keyIndex - 1, 0), 2);
                keyIndex--;
            }
        }

        for (keyIndex = 0; keyIndex < keys.length; keyIndex++) {

            //if we have hit a non-object and we have more keys after this one
            //make an object (or array) here and move on.
            if (typeof reference[keys[keyIndex]] !== "object" && keyIndex < keys.length - 1) {
                if (!isNaN(keys[keyIndex + 1])) {
                    reference[keys[keyIndex]] = [];
                    reference = reference[keys[keyIndex]];
                }
                else {
                    reference[keys[keyIndex]] = {};
                    reference = reference[keys[keyIndex]];
                }
            }
            else if (keyIndex === keys.length - 1) {
                // if we are at the end of the line, set to the model
                reference[keys[keyIndex]] = value;
                if (!isNaN(reference.length)) {
                    $(gaffa.model).trigger("change." + keys.slice(0, keys.length - 2).join("."));
                }
            }
                //otherwise, RECURSANIZE!
            else {
                reference = reference[keys[keyIndex]];
            }
        }
        for (keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            $(gaffa.model).trigger(["change"].concat(keys.slice(0,keyIndex+1)).join("_"));
        }
        
        //ToDo: Fire events for array.length changes
                
        //IMA FIREIN MA CHANGEZOR!
        $(gaffa.model).trigger("change." + keys.join("."));
    }

    function renderView(view, parent) {
        //delegate rendering to happen as soon as possible, but not if it blocks the UI.
        //this will cause all kinds of hilariously stupid layout if you breakpoint during the render loop.
        setTimeout(function() {
            if(view.isArray && !view.isRendered){
                parent.append(view.join(""));
                view.isRendered = true;
            }else if (gaffa.views[view.type] !== undefined) {
                var renderedElement = gaffa.views[view.type].render(view);
                if (parent) {
                    parent.append(renderedElement);
                }
                for (var key in view.views) {
                    for (var i = 0; i < view.views[key].length; i++) {
                        renderView(view.views[key][i], view.viewContainers[key].element);
                    }
                }
                if (view.actions) {
                    for (var actionKey in view.actions) {
                        var eventActions = view.actions[actionKey];
                        view.renderedElement.bind(actionKey, function() {
                            for (var i = 0; i < eventActions.length; i++) {
                                bindAction(eventActions[i], view);
                            }
                        });
                    }
                }
            }
        }, 0);
    }

    //mostly just make sure all the relative bindings are made absolute. delegate actions to the appropriate action object.
    function bindAction(action, parent) {
        for (var key in action.bindings) {
            if (action.bindings[key] && action.bindings[key].binding !== undefined) {
                action.bindings[key].binding = gaffa.paths.getAbsolutePath(parent.binding, action.bindings[key].binding);
            }
        }
        if(typeof gaffa.actions[action.type] === "function"){
            gaffa.actions[action.type](action);
        }
    }

    //gaffa together view properties to model properties.
    function bindView(view, parentView, index) {
        if(gaffa.views[view.type] === undefined){
            return;
        }
        //ToDo: probs a better way to do this....
        $.extend(true, view, $.extend(true, {}, gaffa.views[view.type].defaults, view));
        
        var parentViewBinding = "";
        if (parentView) {            
            parentViewBinding = parentView.binding;    
            if(index !== undefined && !isNaN(index)){                
                parentViewBinding += gaffa.pathSeparator() + index;
            }    
        }

        //if this is a root level view, remove the relative binding.
        // this causes all bindings to cascade as nothing untill a real binding has been set.
        if(parentView){            
            view.binding = gaffa.paths.getAbsolutePath(parentViewBinding, view.binding);
        }else{
            view.binding = parentViewBinding;
        }
        
        //bind each of the views properties to the model.
        for (var key in view.properties) {
            if (parentView && view.properties[key] && view.properties[key].binding) {
                view.properties[key].binding = gaffa.paths.getAbsolutePath(parentViewBinding, view.properties[key].binding);
            
                // this function is to create a closure so that 'key' is still the same key when the event fires.
                (function(key) {
                    if (view.properties[key].binding) {
                        view.properties[key].value = gaffa.model.get(view.properties[key].binding);
                        
                        //jQuerys eventing system is full of winning and unicorn kisses.
                        //changing an object on the model will cause all bindings to its properties to fire
                        //due to event namespacing magic.
                        $(gaffa.model).bind(["change"].concat(view.properties[key].binding.split(gaffa.pathSeparator())).join("."), function() {
                            gaffa.views[view.type].update[key](view, gaffa.model.get(view.properties[key].binding));
                        });
                    }
                })(key);
            }
        }
        
        //recursivly bind child views.
        for (var key in view.views) {
            for (var i = 0; i < view.views[key].length; i++) {
                bindView(view.views[key][i], view);
            }
        }
    }

    function newGaffa() {

        function innerGaffa() {}

        innerGaffa.prototype = {
            paths: {
                //check if a binding is relative, and if it is, make it absolute.
                getAbsolutePath: function(parentBinding, childBinding) {
                    if (childBinding.indexOf(window.gaffa.relativePath()) === 0) {
                        childBinding = childBinding.replace(window.gaffa.relativePath(), "");
                        if (childBinding === "") {
                            return parentBinding;
                        }
                        return parentBinding + window.gaffa.pathSeparator() + childBinding;
                    }
                    else {
                        return childBinding;
                    }
                }
            },
            model: {
                get: function(path) {
                    return get(path, internalmodel);
                },
                set: function(path, value) {
                    return set(path, value, internalmodel);
                },
                update: function(path, value) {

                }
            },
            views: {
                renderTarget: null,
                //Render all, some, or one view/s to a parent or the render target.
                render: function(views, parent) { //parameters optional.
                    //if its a list of views, render them all
                    if (views && views.length) {
                        for (var i = 0; i < views.length; i++) {
                            renderView(views[i], parent);
                        }
                    }
                    //if its just one view, just render it
                    else if (views) {
                        renderView(views, parent);
                    }
                    //if nothing is passed in, render ALL the views!
                    else {
                        for (var i = 0; i < internalViews.length; i++) {
                            renderView(internalViews[i], this.renderTarget || $("body"));
                        }
                    }
                },
                //Add a view or views to another view, or the root list of views if a parent isnt passed.
                //Set up the views bindings as they are added.
                add: function(views, parentView, parentViewChildArray, index) {
                    //if the views isnt an array, make it one.
                    if (views && !views.length) {
                        views = [views];
                    }
                    
                    for (var i = 0; i < views.length; i++) {
                        if(gaffa.views[views[i].type] !== undefined){
                            //if this view has a parent.
                            if (parentView && parentViewChildArray) {
    
                                //bind ALL the things!
                                bindView(views[i], parentView, index);
    
                                parentViewChildArray.push(views[i]);
                            }
                            //otherwise, this view should be in the root list of views.
                            else {
                                bindView(views[i]);
    
                                internalViews.push(views[i]);
                            }
                        }
                    }
                },
                
                //All views get extended with the object that this returns.
                base: function(viewType, createElement, defaults) {
                    return {
                        
                        //This is executed when a view is inserted into the page
                        render: function(viewModel) {
                            //only render if the view has not previously been rendered.                            
                            if (viewModel.renderedElement) {
                                return viewModel.renderedElement;
                            }
                            
                            //extend the passed in view with default options for that view type.
                            $.extend(true, viewModel, defaults, viewModel);
                            
                            //create the root level element for the view
                            viewModel.renderedElement = createElement(viewModel);
                            viewModel.renderedElement[0].viewModel = viewModel;
                            
                            //Automatically fire all of the update functions when the view is first rendered.
                            for (var key in viewModel.properties) {
                                var updateFunction = window.gaffa.views[viewType].update[key];
                                if (updateFunction && typeof updateFunction === "function") {
                                    updateFunction(viewModel, viewModel.properties[key].value, true);
                                }
                            }
                                                        
                            return viewModel.renderedElement;
                        },
                        
                        //functions under this are executed whenever the data bound to by properties of the same name changes.
                        update: {                            
                            //optionally put standard update methods in here, like for example view visibility:
                            visible: function(viewModel, value, firstRun) {
                                if(viewModel.properties.visible.value !== value || firstRun){
                                    viewModel.properties.visible.value = value;
                                    var element = viewModel.renderedElement;
                                    if(element){
                                        if(value !== false){
                                            element.show();
                                        }else{
                                            element.hide();
                                        }
                                    }
                                }                    
                            },
                            classes: function(viewModel, value, firstRun){
                                if(viewModel.properties.classes.value !== value || firstRun){
                                    var element = viewModel.renderedElement;
                                    if (element) {
                                        if(viewModel.properties.classes.value){
                                            element.removeClass(viewModel.properties.classes.value);
                                        }
                                        element.addClass(viewModel.properties.classes.value = value);
                                    }
                                }
                            }
                        },
                        
                        defaults:{
                            //Set the default view binding to nothing but a relative path.
                            //This is so all relative bindings flow on nicely.
                            binding: gaffa.relativePath(),
                            properties: {
                                visible: {},
                                classes: {}
                            }
                        }
                    };
                }
            },
            actions: {
                //placeholder for actions
            },
            behaviours: {
                add: function(behaviours) {
                    //if the views isnt an array, make it one.
                    if (behaviours && !behaviours.length) {
                        behaviours = [behaviours];
                    }
                    
                    for (var i = 0; i < behaviours.length; i++) {
                        (function(behaviour){
                            $(gaffa.model).bind(['change'].concat(behaviour.binding.split('/')).join("_"), function(){
                                for(var i = 0; i < behaviour.actions.length; i++){
                                    if(gaffa.actions[behaviour.actions[i].type] !== undefined){
                                        gaffa.actions[behaviour.actions[i].type](behaviour.actions[i]);
                                    }
                                }     
                            });
                        })(behaviours[i]);
                    }
                }
            },
            utils: {
                //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
                propExists: function(object, propertiesString){
                    var properties = propertiesString.split(".").reverse();
                    while(properties.length){
                        var nextProp = properties.pop();
                        if(object[nextProp] !== undefined){
                            object = object[nextProp];
                        }else{
                            return false;   
                        }
                    }
                    return true;
                }
            }
        };

        return new innerGaffa();
    }
})();