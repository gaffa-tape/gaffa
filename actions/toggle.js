var Gaffa = require('gaffa'),
    actionType = "toggle";

function Toggle(){}
Toggle = Gaffa.createSpec(Toggle, Gaffa.Action);
Toggle.prototype.type = actionType;
Toggle.prototype.trigger = function(){

    this.target.set(!this.target.value, this);
};
Toggle.prototype.target = new Gaffa.Property();

module.exports = Toggle;