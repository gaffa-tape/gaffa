var Gaffa = require('gaffa'),
    actionType = "fromJson";

function FromJson(){}
FromJson = Gaffa.createSpec(FromJson, Gaffa.Action);
FromJson.prototype.type = actionType;
FromJson.prototype.trigger = function(){

    this.target.set(JSON.parse(this.source.value), this);
};
FromJson.prototype.target = new Gaffa.Property();
FromJson.prototype.source = new Gaffa.Property();



module.exports = FromJson;