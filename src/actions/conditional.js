(function (undefined) {
    var actionType = "conditional";
    var opperators = {
        "==": function (a, b) { return a === b },
        "!=": function (a, b) { return a !== b },
        ">": function (a, b) { return a > b },
        "<": function (a, b) { return a < b },
        ">=": function (a, b) { return a >= b },
        "<=": function (a, b) { return a <= b }
    }
    window.gaffa.actions[actionType] = function (action) {
        if (opperators[action.opperator](action.properties.value1.value, action.properties.value2.value)) {
            window.gaffa.actions.trigger(action.trueActions, action.binding);
        } else {
            window.gaffa.actions.trigger(action.falseActions, action.binding);
        }
    };
})();