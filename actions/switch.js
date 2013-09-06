var Gaffa = require('gaffa'),
    actionType = "switch";

function Switch(){}
Switch = Gaffa.createSpec(Switch, Gaffa.Action);
Switch.prototype.type = actionType;
Switch.prototype['switch'] = new Gaffa.Property();

Switch.prototype.trigger = function(parent, scope, event) {
    this.__super__.trigger.apply(this, arguments);

    if(this['switch'].value != null){
        this.triggerActions(this['switch'].value, scope, event);
    }
};

module.exports = Switch;