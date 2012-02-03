(function(undefined){
    
    //Create gaffa
    var gaffa = window.gaffa = window.gaffa || newGaffa();
    
    //"constants"
    // functions to make it 'getter only'
    gaffa.pathSeparator = function(){return "/";};
    gaffa.upALevel = function(){return "..";};

    
    //internal varaibles
    var internalDataModel = {}, //these must always be objects.
        internalPresModel = {};
    
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
        var currentValue = get(path, model),
            fireChanged = false,
            keys = path.split(gaffa.pathSeparator()),
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
        
        if(typeof currentValue === "object"){
            fireChanged = true; 
            //to begin with we won't do a smart compare on objects, just fire changed every time.
            //ToDo: smart compare, and fire events only for changed props.
        }else if(currentValue === value){
            fireChanged = true;
        }
        
        if(fireChanged){
            $(gaffa.model).trigger("change." + keys.join("."));
        }
    }
    
    function newGaffa(){
        
        function gaffa(){            
        }
        
        gaffa.prototype = {
            presModel:{
                get: function(path){
                    return get(path, internalPresModel);
                },
                set: function(path, value){
                    return set(path, value, internalPresModel);                    
                },
                update: function(path, value){
                    
                },
            },
            dataModel: {
                get: function(path){
                    return get(path, internalDataModel);
                },
                set: function(path, value){
                    return set(path, value, internalDataModel);      
                },
                update: function(path, value){
                    
                },
            },
            view: {
                render: function(views){ //parameter optional.
                    
                },
                add: function(views){
                    
                }
            }
        };
        
        return new gaffa();
    }
})();