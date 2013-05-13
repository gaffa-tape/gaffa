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
        actionType = "fetch";
    
    
    function Fetch(){}
    Fetch = Gaffa.createSpec(Fetch, Gaffa.Action);
        
    Fetch.prototype.type = actionType;
    Fetch.prototype.target = new Gaffa.Property();
    Fetch.prototype.source = new Gaffa.Property();
    Fetch.prototype.data = new Gaffa.Property();
    Fetch.prototype.dirty = new Gaffa.Property();
    Fetch.prototype.location = 'server';

    Fetch.prototype.trigger = function(parent, scope, event){
        this.__super__.trigger.apply(this, arguments);

        var action = this,
            gaffa = action.gaffa;

        var errorHandler = function (error) {
            action.gaffa.actions.trigger(action.actions.error, action, scope, event);
            action.gaffa.notifications.notify("fetch.error." + action.kind, error);
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
                        var value = $.extend(true, gaffa.model.get(action.target.binding), value);
                    }
                    action.target.set(
                        value,
                        action,
                        !!action.dirty.value
                    );
                }
                if (action.isModelRefresh && data.model) {
                    action.gaffa.model.set(data.model, false, false, false);
                }
            }
            
            gaffa.actions.trigger(action.actions.success, action, scope, event);
            
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
                if (gaffa.utils.propExists(action, "source.value")) {
                    gaffa.notifications.notify("fetch.begin." + action.kind);
                    gaffa.ajax({
                        //cache: false,
                        type: 'get',
                        crossDomain: action.crossDomain,
                        url: action.source.value,
                        data: action.data.value,
                        dataType: 'json',

                        success:function(data){
                            handleData(action, data);
                        },
                        error: errorHandler,
                        complete:function(){
                            gaffa.notifications.notify("fetch.complete." + action.kind);
                            gaffa.actions.trigger(action.actions.complete, action, scope, event);
                        }
                    });
                }
            }
        }
    }

    return Fetch;

}));