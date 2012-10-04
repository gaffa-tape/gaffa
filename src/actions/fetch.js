(function(undefined) {
    var actionType = "fetch";

    window.gaffa.actions[actionType] = function(action){
        var errorHandler = function (error) {
            if (action.errorActions && action.errorActions.length) {
                window.gaffa.actions.trigger(action.errorActions, action.binding);
            }
            gaffa.notifications.notify("fetch.error." + action.kind, error);
        };
	
        function handleData(action, data){
            if(gaffa.responseIsError && gaffa.responseIsError(data)){
                errorHandler(data);
                return;
            }
            
            if (action.properties.target.binding && data.returnValue) {
                var value = data.returnValue;
                if(action.merge){
                    var value = $.extend(true, window.gaffa.model.get(action.properties.target.binding), value);
                }
                window.gaffa.model.set(action.properties.target.binding, value, action);
            }
            
            if (action.successActions && action.successActions.length) {
                window.gaffa.actions.trigger(action.successActions, action);
            }
            
            gaffa.notifications.notify("fetch.success." + action.kind);
        }
        
        if (action.location === "local") {
            if(window.gaffa.utils.propExists(action, "properties.target.binding")) {
                var localData = localStorage.getItem(action.properties.source.value);
                if(localData === "undefined"){
                    handleData(action, undefined);
                }else{
                    handleData(action, JSON.parse(localData));
                }
            }
        } else if (action.location === "server") {

            if (action.useCache && action.properties.target.value) {
                return;
            }else{
                if (window.gaffa.utils.propExists(action, "properties.source.value")) {
                    gaffa.notifications.notify("fetch.begin." + action.kind);
                    $.ajax({
                        cache: false,
                        type: 'get',
                        url: action.properties.source.value,
                        data: action.properties.data.value,
                        dataType: 'json',
                        contentType: 'application/json',
                        success:function(data){
                            handleData(action, data);
                        },
                        error: errorHandler,
                        complete:function(){                    
                            gaffa.notifications.notify("fetch.complete." + action.kind);
                        }
                    });
                }
            }
        }
    };
})();