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

    function IntervalBehaviour(){}
    IntervalBehaviour = createSpec(IntervalBehaviour, Behaviour);
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
                    triggerActions(behaviour.actions.tick, behaviour);
                    intervalLoop();
                }, behaviour.time || 5000);//If you forget to set the interval, we will be nice and give you 5 seconds of debug time by default, rather than 0ms looping you to death.
            };

        intervalLoop(); 
    };
    IntervalBehaviour.prototype.remove = function(){
        this.killInterval && this.killInterval();
        Behaviour.prototype.remove.call(this);
    }

    return IntervalBehaviour;

}));