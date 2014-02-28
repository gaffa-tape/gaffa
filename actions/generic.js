var Gaffa = require('gaffa'),
    actionType = 'generic';

function Generic(){}
Generic = Gaffa.createSpec(Generic, Gaffa.Action);
Generic.prototype.type = actionType;
Generic.prototype.trigger = function(parent, scope, event){

    this.gaffa.model.get(this.expression, this, scope);
};

module.exports = Generic;