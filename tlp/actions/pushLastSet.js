(function(undefined) {
    var actionType = "pushLastSet",
        gaffa = window.gaffa;
        
    gaffa.actions[actionType] = function(action){
        var toObject = action.bindings.pushTo.value;
        if(toObject === undefined || toObject === null){
            toObject = [];
            gaffa.model.set(action.bindings.pushTo.binding, toObject);
        }
        if (Array.isArray(toObject)) {
            // get last set...
            var fromObj = gaffa.clone(action.bindings.pushFrom.value[action.bindings.pushFrom.value.length -1]);
            // Clear id
            fromObj.id = 0;

            gaffa.model.set(action.bindings.pushTo.binding + gaffa.pathSeparator + toObject.length, fromObj);
        }
    };
})();