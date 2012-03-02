(function (undefined) {

    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa();

    //"constants"
    // functions to make it 'getter only'
    gaffa.pathSeparator = function () {
        return "/";
    };
    gaffa.upALevel = function () {
        return "..";
    };
    gaffa.relativePath = function () {
        return "~";
    };

    //internal varaibles
    var internalmodel = {},
    //these must always be instantiated.
        internalViewModels = [],
		
		bindings = [];

    //internal functions


    /*
    Now I can detect arrays.
    */
    Array.prototype.isArray = true;

    /* maybe switch to this if needed, however i havent had the requirement yet, and mine is faster
        http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    */
	
	Array.prototype.fastEach = function(callback){
		for(var i = 0; i < this.length; i++){
			callback(this[i], i, this);
		}
	}
    // Lots of similarities between get and set, refactor later to reuse code.
    // when lazyLoad === false (default), an event to fetch the model will be raised if the model does not already exist.
    function get(path, model, lazyLoad) {
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

            // Not sure if this is a good place for this, but the intent is to trigger a Fetch event when a model is of type array and empty.
            // A user can then hook in to handle this event (perhaps making a call to a resource (server/storage) to populate the array.
            // Also, why _ for this, but other times its . ?
            if (!lazyLoad) {
                if (reference && reference.isArray) {
                    var raiseFetchEvent = (reference.length === 0);
                    
                    if (!raiseFetchEvent) {
                        for (var arrIndex = 0; arrIndex < reference.length; arrIndex++) {
                            if (reference[arrIndex] === undefined) {
                                // Found a partially loaded array.
                                raiseFetchEvent =true;
                                break;
                            }
                        }
                    }
                    if (raiseFetchEvent) {
                        var eventName = ["fetch"].concat(keys).join("_");
                        $(gaffa.model).trigger(eventName);
                    }
                } else if (reference === undefined) {
                    // recurse up the tree to see if the current undefined model is an element in an array.
                    // NB. set lazyLoad to true so a fetch event is not triggered during the search.
                    var parentModel = get(keys.slice(0, keys.length - 1).join(gaffa.pathSeparator()), model, true);
                    if (parentModel && parentModel.isArray) {
                        var eventName = ["fetch"].concat(keys).join("_");
                        $(gaffa.model).trigger(eventName);
                    }
                }
            }
            return reference;
        }
    }

    function set(path, setValue, model) {
	
		var value;
		
		//Always set value, not refernce.
		if(typeof setValue === "object"){
			if(setValue.isArray){
				value = setValue.slice();
			}else{
				value = $.extend(true, {}, setValue);
			}
		}else{
			value = setValue;
		}	

        //If you just pass in an object, you are overwriting the model.
        if (typeof path === "object") {
            for (var prop in path) {
                model[prop] = path[prop];
                gaffa.model.trigger(prop);
            }
            return;
        }

        var keys = path.split(gaffa.pathSeparator()),
            reference = model,
            keyIndex,
			triggerStack = [];

        //handle "Up A Level"s in the path.
        //yeah yeah, its done differently up above...
        //ToDo: refactor.
        keys.fastEach(function(key, index, keys){
            if (key === gaffa.upALevel()) {
                keys.splice(Math.max(index - 1, 0), 2);
                index--;
            }
        });

        keys.fastEach(function(key, index, keys){

            //if we have hit a non-object and we have more keys after this one
            //make an object (or array) here and move on.
            if (typeof reference[key] !== "object" && index < keys.length - 1) {
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
                    triggerStack.push(keys.slice(0, keys.length - 2).join(gaffa.pathSeparator()));
                }
								
				//Report to things looking for all changes below here.
				var binding = keys.join("_");
				triggerStack.push(binding);
            }
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];
				
				//Report to things looking for all changes below here.
				var binding = keys.slice(0, index + 1).join("_");
				triggerStack.push(binding);
            }
        });

        //ToDo: Fire events for array.length changes

        //IMA FIREIN MA CHANGEZOR!
        gaffa.model.trigger(keys.join(gaffa.pathSeparator()), value);
		
		triggerStack.reverse().fastEach(function(binding){
			gaffa.model.trigger(binding, gaffa.model.get(binding));
		});
    }
	
    function triggerBinding(binding, value) {
		var keys = binding.split(gaffa.pathSeparator()),
			reference = bindings;

		keys.fastEach(function(key, index, keys){
			
			if(!isNaN(key)){
				key = "_"+key;
			}
		
			if (reference != undefined) {
				reference = reference[key];
			}
		});
		
		if (reference != undefined) {
			reference.fastEach(function(callback){
				callback(value);
			});
			
			for(var key in reference){	
				if(reference.hasOwnProperty(key) && reference[key].isArray){
					if(key.indexOf("_") === 0 && !isNaN(key.substr(1))){
						key = key.substr(1);
					}
					if(value !== undefined){
						triggerBinding(binding + gaffa.pathSeparator() + key, value[key]);
					}else{
						triggerBinding(binding + gaffa.pathSeparator() + key, undefined);
					}
				}
			}
		}
    }
	
    function setBinding(binding, callback) {
        var keys = binding.split(gaffa.pathSeparator()),
            reference = bindings;

        keys.fastEach(function(key, index, keys){

			if(!isNaN(key)){
				key = "_"+key;
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
            //otherwise, RECURSANIZE!
            else {
                reference = reference[key];
            }
        });
    }

    function renderView(viewModel, parent) {
        //un-comment to delegate rendering to happen as soon as possible, but not if it blocks the UI.
        //this will cause all kinds of hilariously stupid layout if you breakpoint during the render loop.
        //setTimeout(function () {
            if (viewModel.type === undefined && viewModel.text !== undefined) {
				viewModel.type = "text";
				viewModel.properties = {
					text: { value: viewModel.text}
				};
            }
			if (gaffa.views[viewModel.type] !== undefined) {
					gaffa.views[viewModel.type].render(viewModel);
                if (parent) {
                    parent.appendChild(viewModel.renderedElement);
                }
                for (var key in viewModel.views) {
                    viewModel.views[key].fastEach(function(view, index) {
                        renderView(view, viewModel.viewContainers[key].element);
                    });
                }
                if (viewModel.actions) {
                    for (var actionKey in viewModel.actions) {
                        var eventActions = viewModel.actions[actionKey];
                        $(viewModel.renderedElement).bind(actionKey, function () {
                            eventActions.fastEach(function(eventAction){
                                bindAction(eventAction, viewModel);
                            });
                        });
                    }
                }
            }
        //}, 0);
    }

    //mostly just make sure all the relative bindings are made absolute. delegate actions to the appropriate action object.
    function bindAction(action, parent) {
        for (var key in action.bindings) {
            if (action.bindings[key] && action.bindings[key].binding !== undefined) {
                action.bindings[key].binding = gaffa.paths.getAbsolutePath(parent.binding, action.bindings[key].binding);
            }
        }
        if (typeof gaffa.actions[action.type] === "function") {
            gaffa.actions[action.type](action);
        }
    }

    //gaffa together view properties to model properties.
    function bindView(viewModel, parentView, index) {
        if (gaffa.views[viewModel.type] === undefined) {
            return;
        }
        //ToDo: probs a better way to do this....
        $.extend(true, viewModel, $.extend(true, {}, gaffa.views[viewModel.type].defaults, viewModel));

        var parentViewBinding = "";
        if (parentView) {
            parentViewBinding = parentView.binding;
            if (index !== undefined && !isNaN(index)) {
                parentViewBinding += gaffa.pathSeparator() + index;
            }
        }

        //if this is a root level viewModel, remove the relative binding.
        // this causes all bindings to cascade as nothing untill a real binding has been set.
        if (parentView) {
            viewModel.binding = gaffa.paths.getAbsolutePath(parentViewBinding, viewModel.binding);
        } else {
            viewModel.binding = parentViewBinding;
        }

        //bind each of the views properties to the model.
        for (var key in viewModel.properties) {
            if (parentView && viewModel.properties[key] && viewModel.properties[key].binding) {
                viewModel.properties[key].binding = gaffa.paths.getAbsolutePath(parentViewBinding, viewModel.properties[key].binding);

                // this function is to create a closure so that 'key' is still the same key when the event fires.
                (function (key) {
                    if (viewModel.properties[key].binding) {
                        viewModel.properties[key].value = gaffa.model.get(viewModel.properties[key].binding);

                        gaffa.model.bind(viewModel.properties[key].binding, function (value) {
                            gaffa.views[viewModel.type].update[key](viewModel, value);
                        });
                    }
                })(key);
            }
        }

        //recursivly bind child views.
        for (var key in viewModel.views) {
            viewModel.views[key].fastEach(function(childViewModel){
                bindView(childViewModel, viewModel);
            });
        }
    }

    function newGaffa() {

        function innerGaffa() { }

        innerGaffa.prototype = {
            paths: {
                //check if a binding is relative, and if it is, make it absolute.
                getAbsolutePath: function (parentBinding, childBinding) {
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
                get: function (path) {
                    return get(path, internalmodel);
                },
                set: function (path, value) {
					set(path, value, internalmodel);
                },
                update: function (path, value) {

                },
				bind: function(binding, callback){
					setBinding(binding, callback);
				},
				trigger: function(binding, value){				
					triggerBinding(binding, value);
				}
            },
            views: {
                renderTarget: null,
                //Render all, some, or one view/s to a parent or the render target.
                render: function (viewModels, parent) { //parameters optional.
                    //if its a list of views, render them all
                    if (viewModels && viewModels.length) {
                        viewModels.fastEach(function(viewModel){
                            renderView(viewModel, parent);
                        });
                    }
                    //if its just one view, just render it
                    else if (viewModels) {
                        renderView(viewModels, parent);
                    }
                    //if nothing is passed in, render ALL the viewModels!
                    else {
                        internalViewModels.fastEach(function(internalViewModel){
                            renderView(internalViewModel, this.renderTarget || document.getElementsByTagName('body')[0]);
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

                    viewModels.fastEach(function(viewModel) {
                        if (gaffa.views[viewModel.type] !== undefined) {
                            //if this view has a parent.
                            if (parentView && parentViewChildArray) {

                                //bind ALL the things!
                                bindView(viewModel, parentView, index);

                                parentViewChildArray.push(viewModel);
                            }
                            //otherwise, this view should be in the root list of viewModels.
                            else {
                                bindView(viewModel);

                                internalViewModels.push(viewModel);
                            }
                        }
                    });
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
                            $.extend(true, viewModel, defaults, viewModel);

                            //create the root level element for the view
                            viewModel.renderedElement = createElement(viewModel);
							viewModel.renderedElement.viewModel = viewModel;

                            //Automatically fire all of the update functions when the view is first rendered.
                            for (var key in viewModel.properties) {
                                var updateFunction = window.gaffa.views[viewType].update[key];
                                if (updateFunction && typeof updateFunction === "function") {
                                    updateFunction(viewModel, viewModel.properties[key].value, true);
                                }
                            }
                        },

                        //functions under this are executed whenever the data bound to by properties of the same name changes.
                        update: {
                            //optionally put standard update methods in here, like for example view visibility:
                            visible: function (viewModel, value, firstRun) {
                                if (viewModel.properties.visible.value !== value || firstRun) {
                                    viewModel.properties.visible.value = value;
                                    var element = $(viewModel.renderedElement);
                                    if (element) {
                                        if (value) {
                                            element.show();
                                        } else {
                                            element.hide();
                                        }
                                    }
                                }
                            },
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
                            binding: gaffa.relativePath(),
                            properties: {
                                visible: { value: true },
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
                add: function (behaviours) {
                    //if the views isnt an array, make it one.
                    if (behaviours && !behaviours.length) {
                        behaviours = [behaviours];
                    }

                    behaviours.fastEach(function(behaviour) {
                        var behaviourType = behaviour.type;
                        if (behaviourType === "pageLoad") {
                            (function (behaviour) {
                                    for (var i = 0; i < behaviour.actions.length; i++) {
                                        if (gaffa.actions[behaviour.actions[i].type] !== undefined) {
                                            gaffa.actions[behaviour.actions[i].type](behaviour.actions[i]);
                                        }
                                    }
                            })(behaviour);
                        } else if (behaviourType === "modelChange") {
                            (function (behaviour) {
                                gaffa.model.bind(behaviour.binding.split('/').join("_"), function () {
                                    for (var i = 0; i < behaviour.actions.length; i++) {
                                        if (gaffa.actions[behaviour.actions[i].type] !== undefined) {
                                            gaffa.actions[behaviour.actions[i].type](behaviour.actions[i]);
                                        }
                                    }
                                });
                            })(behaviour);
                        }
                    });
                }
            },
            utils: {
                //See if a property exists on an object without doing if(obj && obj.prop && obj.prop.prop) etc...
                propExists: function (object, propertiesString) {
                    var properties = propertiesString.split(".").reverse();
                    while (properties.length) {
                        var nextProp = properties.pop();
                        if (object[nextProp] !== undefined) {
                            object = object[nextProp];
                        } else {
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
