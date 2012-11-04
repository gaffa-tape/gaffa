(function (undefined) {
    var actionType = "conditional";
    window.gaffa.actions[actionType] = function (action) {
        if (action.properties.condition.value) {
            window.gaffa.actions.trigger(action.actions['true'], action);
        } else {
            window.gaffa.actions.trigger(action.actions['false'], action);
        }
    };
})();