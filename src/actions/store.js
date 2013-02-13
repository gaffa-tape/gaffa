(function (undefined) {
    var actionType = "store";
    
    
    
    
    
    function Store(actionDefinition){
    }
    Store = gaffa.createSpec(Store, gaffa.Action);
    Store.prototype.type = actionType;
    Store.prototype.trigger = function(){
        trigger(this);
    };
    Store.prototype.target = new gaffa.Property();
    Store.prototype.source = new gaffa.Property();
    Store.prototype.returnValue = new gaffa.Property();
    Store.prototype.dirty = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Store;
    
    
    
    
    function trigger(action) {
        var data = JSON.stringify(action.source.value),
            errorHandler = function (error) {
                if (action.actions.error && action.actions.error.length) {
                    window.gaffa.actions.trigger(action.actions.error, action.binding);
                }
                gaffa.notifications.notify("store.error." + action.kind, error);
            };

        if (action.location === "local") {
            localStorage.setItem(action.target.value, data);
        } else if (action.location === "server") {
            gaffa.notifications.notify("store.begin." + action.kind);
			
			var ajaxSettings = {
                cache: false,
                type: 'post',
                url: action.target.value || window.location.pathname,
                data: data,
                dataType: 'json',
                contentType: action.contentType || 'application/json; charset=utf-8',
                success:function(data){
                    if(gaffa.responseIsError && gaffa.responseIsError(data)){
                        errorHandler(data);
                        return;
                    }
                    
                    if (action.returnValue.binding) {
                        var returnValue;
                        if(!data){
                            return;
                        }
                        if(action.returnProperty === ''){
                            returnValue = data;
                        }else if(action.returnProperty){
                            returnValue = data[action.returnProperty];
                        }else{
                            return;
                        }
                        
                        window.gaffa.model.set(
                            action.returnValue.binding,
                            returnValue,
                            action,
                            !!action.dirty.value
                        );
                    }
                    
                    // Mark a portion of the model as clean after a successful store.
                    if(action.cleans){
                        gaffa.model.setDirtyState(action.cleans, false, action);
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
            };
			
			if(action.dataType === 'binary'){

				data = new FormData();
				data.append("items[]", action.source.value);
				ajaxSettings.contentType = false;
				ajaxSettings.processData = false;
				ajaxSettings.data = data;
				dataType = false;
				
			}
			
			$.ajax(ajaxSettings);
        }
    }
})();
