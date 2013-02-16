(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "fromJson";
    
    function FromJson(){}
    FromJson = gaffa.createSpec(FromJson, gaffa.Action);
    FromJson.prototype.type = actionType;
    FromJson.prototype.trigger = function(){
        gaffa.model.set(this.target.binding, JSON.parse(this.source.value), this);
    };
    FromJson.prototype.target = new gaffa.Property();
    FromJson.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = FromJson;
})();