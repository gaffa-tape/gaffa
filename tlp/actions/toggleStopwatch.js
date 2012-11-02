(function (undefined) {
    "use strict";

    var actionType = "toggleStopwatch";
    window.gaffa.actions[actionType] = function (action) {
        $('#stopwatch').toggle();
    };
})();