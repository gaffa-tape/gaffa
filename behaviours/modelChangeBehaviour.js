(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa');
    
    function ModelChangeBehaviour(){}
    ModelChangeBehaviour = createSpec(ModelChangeBehaviour, Behaviour);
    ModelChangeBehaviour.prototype.bind = function(){
        Behaviour.prototype.bind.apply(this, arguments);
        
        var behaviour = this,
            gaffa = behaviour.gaffa;
        
        function executeBehaviour(behaviour, value){
            var currentValue = JSON.stringify(value);

            if(!(behaviour.ignoreIfUnchanged && currentValue === behaviour.previousValue)){
                behaviour.previousValue = currentValue;
                triggerActions(behaviour.actions.change, behaviour);
            }
        }

        behaviour.__callback__ = function (modelChangeEvent){
            var value = modelChangeEvent.getValue();

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
        };
        
        gaffa.model.bind(behaviour.watch || '[]',behaviour.__callback__ , this);
    };
    ModelChangeBehaviour.prototype.remove = function () {
        this.gaffa.gedi.debind(this.__callback__);

        this.__super__.remove.apply(this);
    };

    return ModelChangeBehaviour;
    
}));