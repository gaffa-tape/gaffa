(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.properties.toggle.binding, !gaffa.model.get(action.properties.toggle.binding));
    };
})();