(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "toJson";
    
    function ToJson(){}
    ToJson = gaffa.createSpec(ToJson, gaffa.Action);
    ToJson.prototype.type = actionType;
    ToJson.prototype.trigger = function(){
        gaffa.model.set(this.target.binding, JSON.stringify(this.source.value), this);
    };
    ToJson.prototype.target = new gaffa.Property();
    ToJson.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = ToJson;
})();