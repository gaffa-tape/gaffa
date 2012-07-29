(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.properties.setTo.binding, JSON.stringify(gaffa.model.get(action.properties.setFrom.binding)));            
        }else{
            gaffa.model.set(action.properties.setTo.binding, JSON.stringify(action.properties.setFrom.value));            
        }
    };
})();