var Gaffa = require('gaffa'),
    behaviourType = 'pageLoad';

function PageLoadBehaviour(){}
PageLoadBehaviour = Gaffa.createSpec(PageLoadBehaviour, Gaffa.Behaviour);
PageLoadBehaviour.prototype.type = behaviourType;
PageLoadBehaviour.prototype.bind = function(){
    Gaffa.Behaviour.prototype.bind.apply(this, arguments);
    
    this.gaffa.actions.trigger(this.actions.load, this);
};

module.exports = PageLoadBehaviour;