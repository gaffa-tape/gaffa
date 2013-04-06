(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "fromJson";
    
    function FromJson(){}
    FromJson = gaffa.createSpec(FromJson, gaffa.Action);
    FromJson.prototype.type = actionType;
    FromJson.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        gaffa.model.set(this.target.binding, JSON.parse(this.source.value), this);
    };
    FromJson.prototype.target = new gaffa.Property();
    FromJson.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = FromJson;
})();