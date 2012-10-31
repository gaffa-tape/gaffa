(function (undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function (action) {
        var data = JSON.stringify(action.properties.source.value),
            errorHandler = function (error) {
                if (action.actions.error && action.actions.error.length) {
                    window.gaffa.actions.trigger(action.actions.error, action.binding);
                }
                gaffa.notifications.notify("store.error." + action.kind, error);
            };

        if (action.location === "local") {
            localStorage.setItem(action.properties.target.value, data);
        } else if (action.location === "server") {
            gaffa.notifications.notify("store.begin." + action.kind);
			
			var ajaxSettings = {
                cache: false,
                type: 'post',
                url: action.properties.target.value,
                data: data,
                dataType: 'json',
                contentType: action.contentType || 'application/json; charset=utf-8',
                success:function(data){
                    if(gaffa.responseIsError && gaffa.responseIsError(data)){
                        errorHandler(data);
                        return;
                    }
                    
                    if (action.properties.returnValue.binding && data.returnValue) {
                        window.gaffa.model.set(action.properties.returnValue.binding, data.returnValue, action);
                    }
                    
                    if (action.actions.success && action.actions.success.length) {
                        window.gaffa.actions.trigger(action.actions.success, action);
                    }
                    
                    gaffa.notifications.notify("store.success." + action.kind);
                },
                error: errorHandler,
                complete:function(){                    
                    gaffa.notifications.notify("store.complete." + action.kind);
                }
            }
			
			if(action.dataType === 'binary'){

				data = new FormData();
				data.append("items[]", action.properties.source.value);
				ajaxSettings.contentType = false;
				ajaxSettings.processData = false;
				ajaxSettings.data = data;
				dataType = false;
				
			}
			
			$.ajax(ajaxSettings);
        }
    };
})();