//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(window.gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            window.gaffa.model.set(action.bindings.setTo.binding,window. gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            window.gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();