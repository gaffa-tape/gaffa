(function(undefined) {
    var actionType = "set",
        gaffa = window.gaffa;
        
    window.gaffa.actions[actionType] = function(action){
            var fromObj = action.bindings.setFrom.value;
            if(!(action.bindings.clone && action.bindings.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            window.gaffa.model.set(action.bindings.setTo.binding, fromObj);            
    };
})();