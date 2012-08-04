(function(undefined) {
    var actionType = "set",
        gaffa = window.gaffa;
        
    window.gaffa.actions[actionType] = function(action){
            var fromObj = action.properties.source.value;
            if(!(action.properties.clone && action.properties.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            window.gaffa.model.set(action.properties.target.binding, fromObj, action);            
    };
})();