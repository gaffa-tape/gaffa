(function(undefined) {
    var actionType = "pop",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        if(action.properties.popFrom.value && action.properties.popFrom.value.pop){
            var popFromArray = action.properties.popFrom.value;            
            gaffa.model.set(action.properties.popTo.binding, popFromArray.pop());
            gaffa.model.set(action.properties.popFrom.binding, popFromArray);
        }
    };
})();