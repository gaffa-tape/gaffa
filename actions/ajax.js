var Gaffa = require('gaffa'),
    actionType = "ajax";

function Ajax(actionDefinition){
}
Ajax = Gaffa.createSpec(Ajax, Gaffa.Action);
Ajax.prototype.type = actionType;
Ajax.prototype.method = new Gaffa.Property({
    value: 'GET'
});
Ajax.prototype.auth = new Gaffa.Property();
Ajax.prototype.dataType = 'json';
Ajax.prototype.trigger = function(parent, scope, event){
    this.__super__.trigger.apply(this, arguments);

    var action = this,
        gaffa = this.gaffa,
        data = action.source.value,
        errorHandler = function (error) {
            action.triggerActions('error', scope, event);
            gaffa.notifications.notify("ajax.error." + action.kind, error);
        };

    gaffa.notifications.notify("ajax.begin." + action.kind);

    if(action.dataType === 'formData'){
        var formData = new FormData();
        for(var key in data){
            if(data.hasOwnProperty(key)){
                data[key] != null && formData.append(key, data[key]);
            }
        }
        data = formData;
    }
    
    var ajaxSettings = {
        cache: action.cache,
        type: action.method.value,
        url: action.url.value || window.location.pathname,
        data: data,
        dataType: action.dataType,
        auth: action.auth.value,
        contentType: action.contentType,
        success:function(data){
            if(gaffa.responseIsError && gaffa.responseIsError(data)){
                errorHandler(data);
                return;
            }
                            
            action.target.set(data);
            
            // Mark a portion of the model as clean after a successful request.
            if(action.cleans !== false && action.target.binding){
                gaffa.model.setDirtyState(action.target.binding, false, action);
            }

            scope = scope || {};

            scope.data = data;
            
            action.triggerActions('success', scope, event);
            
            gaffa.notifications.notify("ajax.success." + action.kind);
        },
        error: errorHandler,
        complete:function(){
            action.triggerActions('complete', scope, event);
            gaffa.notifications.notify("ajax.complete." + action.kind);
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
    
};
Ajax.prototype.target = new Gaffa.Property();
Ajax.prototype.source = new Gaffa.Property();
Ajax.prototype.dirty = new Gaffa.Property();
Ajax.prototype.url = new Gaffa.Property();

module.exports = Ajax;