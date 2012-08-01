(function (undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function (action) {
        var data = JSON.stringify(action.properties.setFrom.value),
            errorHandler = function (error) {
                if (action.errorActions && action.errorActions.length) {
                    window.gaffa.actions.trigger(action.errorActions, action.binding);
                }
            };

        if (action.location === "local") {
            localStorage.setItem(action.path, data);
        } else if (action.location === "server") {
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
                            window.gaffa.actions.trigger(action.successActions, action.parent);
                        }
                    }
                },
                error: errorHandler
            });
        }
    };
})();