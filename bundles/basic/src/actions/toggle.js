(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();