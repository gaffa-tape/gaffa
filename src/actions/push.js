(function(undefined) {
    var actionType = "push",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        var toObject = action.properties.target.value;
        if(toObject === undefined || toObject === null){
            toObject = [];
            gaffa.model.set(action.properties.target.binding, toObject);
        }
        if(toObject.isArray){
            var fromObj = action.properties.source.value;
            if(!(action.properties.clone && action.properties.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            pushToBinding = gaffa.paths.getViewItemPath(action, action.properties.target.binding, "[~" + toObject.length + "]");
            gaffa.model.set(pushToBinding, fromObj);            
        }
    };
})();