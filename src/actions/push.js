(function(undefined) {
    var actionType = "push",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        var toObject = action.properties.target.value;
        if(toObject === undefined || toObject === null){
            toObject = [];
            gaffa.model.set(action.properties.target.binding, toObject, action);
        }
        if(Array.isArray(toObject)){
            var fromObj = action.properties.source.value;
            if(!(action.properties.clone && action.properties.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            pushToBinding = action.getPath().append(action.properties.target.binding, gaffa.relativePath + gaffa.pathSeparator + toObject.length);
            gaffa.model.set(pushToBinding, fromObj, action);            
        }
    };
})();