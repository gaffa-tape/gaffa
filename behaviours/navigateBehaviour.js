var Gaffa = require('gaffa'),
    behaviourType = 'navigate';

function Navigate(){}
Navigate = Gaffa.createSpec(Navigate, Gaffa.Behaviour);
Navigate.prototype.type = behaviourType;
Navigate.prototype.bind = function(){
    Gaffa.Behaviour.prototype.bind.apply(this, arguments);

    var behaviour = this;

    this.gaffa.notifications.add('navigation', function(){
    	behaviour.gaffa.actions.trigger(behaviour.actions.navigate, behaviour);
    });
};

module.exports = Navigate;