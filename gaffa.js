(function(undefined){
    
    //Create gaffa
    window.gaffa = window.gaffa || newGaffa();
    
    //internal varaibles
    var internalDataModel = {}, //these must always be objects.
        internalPresModel = {};
    
    //internal functions
    
    //Lost of similarities between get and set, refactor later to reuse code.
    function get(path, model){
        var keys = path.split("/"),
            reference = model;
            
        for(var keyIndex = 0; keyIndex < keys.length; keyIndex++){
            //Up a level.
            if(keys[keyIndex] === ".."){
                keys.splice(Math.max(keyIndex-1,0), keyIndex);
                keyIndex--;
            }else{
                if(typeof reference[keys[keyIndex]] === "object"){
                    reference = reference[keys[keyIndex]];
                }else if(reference[keys[keyIndex]] == undefined){
                    reference = undefined;
                    break;
                }else{
                    reference = reference[keys[keyIndex]];
                }
            }
        }
        
        return reference;   
    }
    
    function set(path, value, model){
        var currentValue = get(path, model),
            fireChanged = false,
            keys = path.split("/"),
            reference = model,
            keyIndex;
            
        for(keyIndex = 0; keyIndex < keys.length; keyIndex++){
            //Up a level.
            if(keys[keyIndex] === ".."){
                keys.splice(Math.max(keyIndex-1,0), keyIndex);
                keyIndex--;
            }
        }
        
        for(keyIndex = 0; keyIndex < keys.length; keyIndex++){
            //Up a level.
            if(typeof reference[keys[keyIndex]] !== "object" && keyIndex < keys.length - 1){
                if(!isNaN(keys[keyIndex + 1])){
                    reference[keys[keyIndex]] = [];
                    reference = reference[keys[keyIndex]];
                }else{
                    reference[keys[keyIndex]] = {};
                    reference = reference[keys[keyIndex]];
                }
            }else if(keyIndex === keys.length - 1){
                reference[keys[keyIndex]] = value;
            }else{
                reference = reference[keys[keyIndex]];
            }
        }
        
        if(typeof currentValue === "object"){
            fireChanged = true;
            currentValue = value;
        }else if(currentValue === value){
            fireChanged = true;
        }
        
        if(fireChanged){
            $().trigger();
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