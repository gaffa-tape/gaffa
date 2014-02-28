var Gaffa = require('gaffa'),
    actionType = "toJson";

function ToJson(){}
ToJson = Gaffa.createSpec(ToJson, Gaffa.Action);
ToJson.prototype.type = actionType;
ToJson.prototype.trigger = function(){

    this.target.set(JSON.stringify(this.source.value), this);
};
ToJson.prototype.target = new Gaffa.Property();
ToJson.prototype.source = new Gaffa.Property();

module.exports = ToJson;