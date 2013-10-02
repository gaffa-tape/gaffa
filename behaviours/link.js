var Gaffa = require('gaffa'),
    behaviourType = 'link';

function LinkBehaviour(){}
LinkBehaviour = Gaffa.createSpec(LinkBehaviour, Gaffa.Behaviour);
LinkBehaviour.prototype.type = behaviourType;
LinkBehaviour.prototype.target = new Gaffa.Property();
LinkBehaviour.prototype.source = new Gaffa.Property({
    update: function(behaviour, value){
        behaviour.target.set(value);
    },
    sameAsPrevious: function(){
        return false;
    }
});

module.exports = LinkBehaviour;