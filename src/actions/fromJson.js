(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();