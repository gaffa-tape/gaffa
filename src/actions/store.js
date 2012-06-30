(function (undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function (action) {
        var data,
            errorHandler = function (error) {
                if (action.errorActions && action.errorActions.length) {
                    window.gaffa.actions.trigger(action.errorActions, action.binding);
                }
            };
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
                    success:function(data){
                        if (data && (!data.status || (data.status && data.status === 2))) { // TODO add Status codes to gaffa. Currently assuming 1 == Success, 2 (or not set) == Error
                            errorHandler(data);
                        } else {
                            if (action.successActions && action.successActions.length) {
                                window.gaffa.actions.trigger(action.successActions, action.binding);
                            }
                        }
                    },
                    error: errorHandler
                });
            }
        }
    };
})();