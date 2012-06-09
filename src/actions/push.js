(function(undefined) {
    var actionType = "push",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        var toObject = action.bindings.pushTo.value;
        if(toObject === undefined || toObject === null){
            toObject = [];
            gaffa.model.set(action.bindings.pushTo.binding, toObject);
        }
        if(toObject.isArray){
            var fromObj = action.bindings.pushFrom.value;
            if(!(action.bindings.clone && action.bindings.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            gaffa.model.set(action.bindings.pushTo.binding + gaffa.pathSeparator + toObject.length, fromObj);            
        }
    };
})();