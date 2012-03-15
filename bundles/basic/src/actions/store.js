(function (undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function (action) {
        var data;
        if (gaffa.utils.propExists(action, "bindings.setFrom.binding")) {
            data = JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding));
        } else {
            data = JSON.stringify(action.bindings.setFrom.value);
        }

        if (action.location === "local") {
            localStorage.setItem(action.path, data);
        } else if (action.location === "server") {
            if (window.gaffa.utils.propExists(action, "bindings.setFrom.binding")) {
                $.ajax({
                    cache: false,
                    type: 'post',
                    url: action.path,
                    data: data,
                    dataType: 'json',
                    contentType: 'application/json',
                    error: function (error) {
                        console.log("Store action failed with server response: " + error.status);
                    }
                });
            }
        }
    };
})();