(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        behaviourType = 'modelChange';
    
        
    function executeBehaviour(behaviour, value){
        gaffa.actions.trigger(behaviour.actions.change, behaviour);
    }

    function ModelChangeBehaviour(){}
    ModelChangeBehaviour = Gaffa.createSpec(ModelChangeBehaviour, Gaffa.Behaviour);
    ModelChangeBehaviour.prototype.type = behaviourType;
    ModelChangeBehaviour.prototype.watch = new Gaffa.Property(function(behaviour, value){
        var gaffa = behaviour.gaffa;

        if(!value){
            return;
        }

        var throttleTime = behaviour.throttle;
        if(!isNaN(throttleTime)){
            var now = new Date();
            if(!behaviour.lastTrigger || now - behaviour.lastTrigger > throttleTime){
                behaviour.lastTrigger = now;
                executeBehaviour(behaviour, value);
            }else{
                clearTimeout(behaviour.timeout);
                behaviour.timeout = setTimeout(function(){
                        behaviour.lastTrigger = now;
                        executeBehaviour(behaviour, value);
                    },
                    throttleTime - (now - behaviour.lastTrigger)
                );
            }
        }else{
            executeBehaviour(behaviour, value);
        }
    });

    return ModelChangeBehaviour;
    
}));