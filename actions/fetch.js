(function(undefined) {
    var actionType = "fetch";
    
    
    function Fetch(actionDefinition){
        this.constructor.apply(this, arguments);
    }
    Fetch.prototype = new gaffa.Action();
    Fetch.prototype.trigger = function(){
        trigger(this);
    };
        
    Fetch.prototype.target = new gaffa.Property();
    Fetch.prototype.source = new gaffa.Property();
    Fetch.prototype.data = new gaffa.Property();
    Fetch.prototype.dirty = new gaffa.Property();
    Fetch.prototype.location = 'server';
    
    window.gaffa.actions[actionType] = Fetch;

    function trigger(action){
        var errorHandler = function (error) {
            window.gaffa.actions.trigger(action.actions.error, action.binding);
            gaffa.notifications.notify("fetch.error." + action.kind, error);
        };
    
        function handleData(action, data){
            if(gaffa.responseIsError && gaffa.responseIsError(data)){
                errorHandler(data);
                return;
            }
            
            if (action.target.binding) {
                if (data) {
                    var value = data;

                    if(action.transform){
                        value = gaffa.model.get(action.transform, {data: value});
                    }

                    if(action.merge){
                        var value = $.extend(true, window.gaffa.model.get(action.target.binding), value);
                    }
                    window.gaffa.model.set(
                        action.target.binding,
                        value,
                        action,
                        !!action.dirty.value
                    );
                }
                if (action.isModelRefresh && data.model) {
                    window.gaffa.model.set(data.model, false, false, false);
                }
            }
            
            window.gaffa.actions.trigger(action.actions.success, action);
            
            gaffa.notifications.notify("fetch.success." + action.kind);
        }
        
        if (action.location === "local") {
            var localData = localStorage.getItem(action.source.value);
            if(localData === "undefined"){
                handleData(action, undefined);
            }else{
                handleData(action, JSON.parse(localData));
            }
        } else if (action.location === "server") {

            if (action.useCache && action.target.value) {
                return;
            }else{
                if (window.gaffa.utils.propExists(action, "source.value")) {
                    gaffa.notifications.notify("fetch.begin." + action.kind);
                    $.ajax({
                        //cache: false,
                        type: 'get',
                        crossDomain: action.crossDomain,
                        url: action.source.value,
                        data: action.data.value,
                        dataType: 'json',
                        contentType: 'application/json',

                        success:function(data){
                            handleData(action, data);
                        },
                        error: errorHandler,
                        complete:function(){
                            gaffa.notifications.notify("fetch.complete." + action.kind);
                            window.gaffa.actions.trigger(action.actions.complete, action);
                        }
                    });
                }
            }
        }
    }
})();