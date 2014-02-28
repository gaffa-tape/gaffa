var Gaffa = require('gaffa'),
    actionType = "remove";

function Remove(){}
Remove = Gaffa.createSpec(Remove, Gaffa.Action);
Remove.prototype.type = actionType;
Remove.prototype.trigger = function(){

    this.gaffa.model.remove(this.target.binding, this, this.cleans.value ? false : null);
};
Remove.prototype.target = new Gaffa.Property();
Remove.prototype.cleans = new Gaffa.Property();



module.exports = Remove;