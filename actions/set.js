//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();