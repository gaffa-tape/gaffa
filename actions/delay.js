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
        actionType = "delay";
    
    function Delay(){}
    Delay = Gaffa.createSpec(Delay, Gaffa.Action);
    Delay.prototype.type = actionType;
    Delay.prototype.delay = new Gaffa.Property();

    Delay.prototype.trigger = function(parent, scope, event) {
        this.__super__.trigger.apply(this, arguments);

        var action = this;

        setTimeout(function(){
            action.gaffa.actions.trigger(action.actions['trigger'], action, scope, event);
        }, this.delay.value);
    };
    
    return Delay;    
}));