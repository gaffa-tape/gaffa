var Gaffa = require('gaffa'),
    behaviourType = 'interval';

function IntervalBehaviour(){}
IntervalBehaviour = Gaffa.createSpec(IntervalBehaviour, Gaffa.Behaviour);
IntervalBehaviour.prototype.type = behaviourType;
IntervalBehaviour.prototype.bind = function(){
    Behaviour.prototype.bind.apply(this, arguments);
    var behaviour = this,
        loop = true,
        currentTimeout,
        intervalLoop = function(){

            behaviour.killInterval = function(){
                loop = false;
                clearTimeout(currentTimeout);
            };

            if(!loop){
                return;
            }

            currentTimeout = setTimeout(function(){
                behaviour.triggerActions(behaviour.actions.tick, behaviour);
                intervalLoop();
            }, behaviour.time || 5000);//If you forget to set the interval, we will be nice and give you 5 seconds of debug time by default, rather than 0ms looping you to death.
        };

    intervalLoop();
};
IntervalBehaviour.prototype.remove = function(){
    this.killInterval && this.killInterval();
    Behaviour.prototype.remove.call(this);
}

module.exports = IntervalBehaviour;