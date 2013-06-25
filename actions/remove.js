var Gaffa = require('gaffa'),
    actionType = "remove";

function Remove(){}
Remove = Gaffa.createSpec(Remove, Gaffa.Action);
Remove.prototype.type = actionType;
Remove.prototype.trigger = function(){
    this.__super__.trigger.apply(this, arguments);
    
    this.gaffa.model.remove(this.target.binding, this);
};
Remove.prototype.target = new Gaffa.Property();



module.exports = Remove;