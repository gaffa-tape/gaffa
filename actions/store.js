(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        actionType = "store";
    
    function Store(actionDefinition){
    }
    Store = Gaffa.createSpec(Store, Gaffa.Action);
    Store.prototype.type = actionType;
    Store.prototype.location = 'server';
    Store.prototype.requestType = 'post';
    Store.prototype.dataType = 'json';
    Store.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);

        var action = this,
            data = action.source.value,
            errorHandler = function (error) {
                gaffa.actions.trigger(action.actions.error, action.binding);
                gaffa.notifications.notify("store.error." + action.kind, error);
            };

        if (action.location === "local") {
            localStorage.setItem(action.target.value, JSON.stringify(data));
        } else if (action.location === "server") {
            gaffa.notifications.notify("store.begin." + action.kind);

            switch(action.dataType){
                case "formData":
                    var formData = new FormData();
                    for(var key in data){
                        if(data.hasOwnProperty(key)){
                            data[key] != null && formData.append(key, data[key]);
                        }
                    }
                    data = formData;
                break;
                case "json":
                    data = JSON.stringify(data);
                break;
            }
            
            var ajaxSettings = {
                cache: false,
                type: action.requestType || 'post',
                url: action.target.value || window.location.pathname,
                data: data,
                dataType: 'json',
                auth: action.auth,
                contentType: action.contentType,
                success:function(data){
                    if(gaffa.responseIsError && gaffa.responseIsError(data)){
                        errorHandler(data);
                        return;
                    }
                    
                    if (action.returnValue.binding) {
                        var value;
                        if(!data){
                            return;
                        }
                        if(action.transform){
                            value = gaffa.model.get(action.transform, {data: data});
                        }
                        
                        action.returnValue.set(
                            value,
                            action,
                            !!action.dirty.value
                        );
                    }
                    
                    // Mark a portion of the model as clean after a successful store.
                    if(action.cleans){
                        gaffa.model.setDirtyState(action.cleans, false, action);
                    }
                    
                    gaffa.actions.trigger(action.actions.success, action, {data: data});
                    
                    gaffa.notifications.notify("store.success." + action.kind);
                },
                error: errorHandler,
                complete:function(){
                    gaffa.actions.trigger(action.actions.complete, action);
                    gaffa.notifications.notify("store.complete." + action.kind);
                }
            };
            
            if(action.dataType === 'file'){
                data = new FormData();
                data.append("file", action.source.value);
                ajaxSettings.contentType = false;
                ajaxSettings.processData = false;
                ajaxSettings.data = data;
                dataType = false;                
            }
            
            gaffa.ajax(ajaxSettings);
        }
    };
    Store.prototype.target = new Gaffa.Property();
    Store.prototype.source = new Gaffa.Property();
    Store.prototype.returnValue = new Gaffa.Property();
    Store.prototype.dirty = new Gaffa.Property();

    return Store;

}));