(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-toJson = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        actionType = "toJson";
    
    function ToJson(){}
    ToJson = gaffa.createSpec(ToJson, gaffa.Action);
    ToJson.prototype.type = actionType;
    ToJson.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        gaffa.model.set(this.target.binding, JSON.stringify(this.source.value), this);
    };
    ToJson.prototype.target = new gaffa.Property();
    ToJson.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = ToJson;

    return ToJson;

}));