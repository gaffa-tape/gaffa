(function(undefined){
    
    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa();
    
    //"constants"
    // functions to make it 'getter only'
    gaffa.pathSeparator = function(){return "/";};
    gaffa.upALevel = function(){return "..";};
    gaffa.relativePath = function(){return "~";};

    
    //internal varaibles
    var internalmodel = {}, //these must always be instantiated.
        internalViews = [];
    
    //internal functions
    
    //Lots of similarities between get and set, refactor later to reuse code.
    function get(path, model){
        var keys = path.split(gaffa.pathSeparator()),
            reference = model;
            
        for(var keyIndex = 0; keyIndex < keys.length; keyIndex++){
            
            //Up a level string. if encountered, knock out the previous key and the current one.
            if(keys[keyIndex] === gaffa.upALevel()){
                keys.splice(Math.max(keyIndex-1,0), 2);
                keyIndex--;
                                
            }else{
                
                /*  
                    if the thing at the current key in the model is an object
                    or an array (both typeof to object),
                    set it as the thing we want to look into next.
                */
                if(typeof reference[keys[keyIndex]] === "object"){
                    reference = reference[keys[keyIndex]];
                    
                /* 
                    else if there isn't anything at this key, exit the loop,
                    and return undefined.
                */   
                }else if(reference[keys[keyIndex]] === undefined){
                    reference = undefined;
                    break;
                    
                /*  
                    otherwise, we're at the end of the line. return whatever's
                    there
                */
                }else{
                    reference = reference[keys[keyIndex]];
                    break;
                }
            }
        }
                
        return reference;   
    }
    
    function set(path, value, model){
        var keys = path.split(gaffa.pathSeparator()),
            reference = model,
            keyIndex;
            
        for(keyIndex = 0; keyIndex < keys.length; keyIndex++){
            //Up a level.
            if(keys[keyIndex] === gaffa.upALevel()){
                keys.splice(Math.max(keyIndex-1,0), 2);
                keyIndex--;
            }
        }
        
        for(keyIndex = 0; keyIndex < keys.length; keyIndex++){
            
            //if we have hit a non-object and we have more keys after this one
            //make an object (or array) here and move on.
            if(typeof reference[keys[keyIndex]] !== "object" && keyIndex < keys.length - 1){
                if(!isNaN(keys[keyIndex + 1])){
                    reference[keys[keyIndex]] = [];
                    reference = reference[keys[keyIndex]];
                }else{
                    reference[keys[keyIndex]] = {};
                    reference = reference[keys[keyIndex]];
                }
                
            // if we are at the end of the line, set to the model
            }else if(keyIndex === keys.length - 1){
                reference[keys[keyIndex]] = value;
                
            //otherwise, RECURSANIZE!
            }else{
                reference = reference[keys[keyIndex]];
            }
        }
        
        $(gaffa.model).trigger("change." + keys.join("."));        
    }
    
    function renderView(view, parent){
        setTimeout(function(){
            if(gaffa.views[view.type] !== undefined){
                var renderedElement = gaffa.views[view.type].render(view);
                if(parent){
                    parent.append(renderedElement);
                }
                for(var key in view.views){
                    for(var i = 0; i < view.views[key].length; i ++){                        
                        renderView(view.views[key][i], view.viewContainers[key]);
                    }
                }
            }
        },0);
    }
    
    function bindView(view, parentView){
        for( var key in view.properties){
            if(parentView && view.properties[key] && view.properties[key].binding){
                view.properties[key].binding = gaffa.paths.getAbsolutePath(parentView.binding ,view.properties[key].binding);
            }
            // this function is to create a closure so that 'key' is still the same key when the event fires.
            (function(key){
                view.properties[key].value = gaffa.model.get(view.properties[key].binding);
                $(gaffa.model).bind(["change"].concat( view.properties[key].binding.split(gaffa.pathSeparator())).join("."), function(){
                    gaffa.views[view.type].update[key](view, gaffa.model.get(view.properties[key].binding));
                });
            })(key);
        }
        
        for( var key in view.views){
            for(var i = 0; i < view.views[key].length; i++){
                bindView(view.views[key][i], view);
            }
        }
    }
    
    function newGaffa(){
        
        function gaffa(){            
        }
        
        gaffa.prototype = {
            paths: {
                getAbsolutePath: function(parentBinding, childBinding){
                    if(childBinding.indexOf(gaffa.relativePath) === 0){
                        childBinding.replace(gaffa.relativePath, "");
                        return parentBinding + gaffa.pathSeparator + childBinding;
                    }else{
                        return childBinding;
                    }
                }
            },
            model: {
                get: function(path){
                    return get(path, internalmodel);
                },
                set: function(path, value){
                    return set(path, value, internalmodel);      
                },
                update: function(path, value){
                    
                }
            },
            views: {
                render: function(views, parent){ //parameters optional.
                   if(views && views.length){
                       for(var i = 0; i < views.length; i ++){
                            renderView(views[i], parent);
                       }
                   }else if(views){
                       renderView(views, parent);
                   }else{
                       for(var i = 0; i < internalViews.length; i ++){
                            renderView(internalViews[i], $("body"));
                       }
                   }
                },
                add: function(views, parentView, parentViewChildArray){
                    if(views && !views.length){
                       views = [views];
                    }
                    
                    for(var i = 0; i < views.length; i ++){
                        if(parentView && parentViewChildArray){
                            
                            //bind ALL the things!
                            bindView(views[i], parentView);
                            
                            parentViewChildArray.push(views[i]);
                        }else{
                            
                            //top level views, can't exactly recurse bind to nothin' now can we...
                            bindView(views[i]);
                            
                            for(var key in views[i].views){
                                for(var j = 0; j < views[i].views[key].length; j++){
                                    bindView(views[i].views[key][j], views[i]);
                                }
                            }
                            internalViews.push(views[i]);
                        }
                   }
                },
                base: function(viewType, createElement, defaults){
                    return {
                        render: function(viewModel) {
            			if (viewModel.renderedElement) {
        					return viewModel.renderedElement;
        				}
        
        				$.extend(true, viewModel, defaults, viewModel);
                        
                        viewModel.renderedElement = createElement(viewModel);
                        
                        for(var key in viewModel.properties){
                            window.gaffa.views[viewType].update[key](viewModel, viewModel.properties[key].value, true);
                        }
        
        				return viewModel.renderedElement;
                        }
                    }
    			}
            }
        };
        
        return new gaffa();
    }
})();