(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.properties.setTo.binding, JSON.parse(gaffa.model.get(action.properties.setFrom.binding)));            
        }else{
            gaffa.model.set(action.properties.setTo.binding, JSON.parse(action.properties.setFrom.value));            
        }
    };
})();