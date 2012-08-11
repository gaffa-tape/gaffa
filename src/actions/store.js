(function (undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function (action) {
        var data = JSON.stringify(action.properties.source.value),
            errorHandler = function (error) {
                if (action.errorActions && action.errorActions.length) {
                    window.gaffa.actions.trigger(action.errorActions, action.binding);
                }
            };

        if (action.location === "local") {
            localStorage.setItem(action.properties.target.value, data);
        } else if (action.location === "server") {
                $.ajax({
                    cache: false,
                    type: 'post',
                    url: action.properties.target.value,
                    data: data,
                    dataType: 'json',
                    contentType: 'application/json',
                    success:function(data){
                        if (data){
                            if (!data.status || (data.status && data.status === 2)) { // TODO add Status codes to gaffa. Currently assuming 1 == Success, 2 (or not set) == Error
                                errorHandler(data);
                                return;
                            } else if (action.properties.returnValue.binding && data.returnValue) {
                                window.gaffa.model.set(action.properties.returnValue.binding, data.returnValue, action);
                            }
                        }
                        
                        if (action.successActions && action.successActions.length) {
                            window.gaffa.actions.trigger(action.successActions, action);
                        }
                    },
                    error: errorHandler
                });
            }
    };
})();