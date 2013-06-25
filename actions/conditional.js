var Gaffa = require('gaffa'),
    actionType = "conditional";

function Conditional(){}
Conditional = Gaffa.createSpec(Conditional, Gaffa.Action);
Conditional.prototype.type = actionType;
Conditional.prototype.condition = new Gaffa.Property();

Conditional.prototype.trigger = function(parent, scope, event) {
    this.__super__.trigger.apply(this, arguments);

    if (this.condition.value) {
        this.gaffa.actions.trigger(this.actions['true'], this, scope, event);
    } else {
        this.gaffa.actions.trigger(this.actions['false'], this, scope, event);
    }           
};



module.exports =  Conditional;