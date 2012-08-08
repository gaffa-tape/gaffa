(function (undefined) {
    var actionType = "conditional";
    window.gaffa.actions[actionType] = function (action) {
        if (action.properties.condition.value) {
            window.gaffa.actions.trigger(action.trueActions, action);
        } else {
            window.gaffa.actions.trigger(action.falseActions, action);
        }
    };
})();