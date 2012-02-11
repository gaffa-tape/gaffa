//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "push";
    window.gaffa.actions[actionType] = function(action){
        var toObject = window.gaffa.model.get(action.bindings.pushTo.binding);
        if(toObject.isArray){
            if(window.gaffa.utils.propExists(action, "bindings.pushFrom.binding")){            
                window.gaffa.model.set(action.bindings.pushTo.binding + window.gaffa.pathSeparator() + toObject.length, window.gaffa.model.get(action.bindings.pushFrom.binding));                
            }else{
                window.gaffa.model.set(action.bindings.pushTo.binding + window.gaffa.pathSeparator() + toObject.length, action.bindings.pushFrom.value);            
            }
        }
    };
})();