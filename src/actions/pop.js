(function(undefined) {
    var actionType = "pop",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        if(action.properties.popFrom.value && action.properties.popFrom.value.pop){
            var popFromArray = action.properties.popFrom.value,
                poppedValue = popFromArray.pop();
                
            action.properties.popTo.binding && gaffa.model.set(action.properties.popTo.binding, poppedValue, action);
            gaffa.model.set(action.properties.popFrom.binding, popFromArray, action);
        }
    };
})();