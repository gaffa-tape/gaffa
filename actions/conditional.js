var Gaffa = require('gaffa'),
    actionType = "conditional";

function Conditional(){}
Conditional = Gaffa.createSpec(Conditional, Gaffa.Action);
Conditional.prototype.type = actionType;
Conditional.prototype.condition = new Gaffa.Property();

Conditional.prototype.trigger = function(parent, scope, event) {

    if (this.condition.value) {
        this.triggerActions('true', scope, event);
    } else {
        this.triggerActions('false', scope, event);
    }
};



module.exports =  Conditional;