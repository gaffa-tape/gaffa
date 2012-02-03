(function(undefined){
    
    //Create gaffa
    window.gaffa = window.gaffa || newGaffa();
    
    //internal varaibles
    var internalDataModel,
        internalPresModel;
    
    //internal functions
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
                }else{
                    reference = undefined;
                    break;
                }
            }
        }
        
        return reference;   
    }
    
    function newGaffa(){
        
        function gaffa(){
            
        }
        
        gaffa.prototype = {
            presModel:{
                get: function(path){
                    return get(path, internalPresModel);
                },
                set: function(key, value){
                    
                },
                update: function(key, value){
                    
                },
            },
            dataModel: {
                get: function(path){
                    return get(path, internalDataModel);
                },
                set: function(key, value){
                    
                },
                update: function(key, value){
                    
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