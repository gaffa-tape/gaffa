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
        actionType = "conditional";
    
    function Conditional(){}
    Conditional = Gaffa.createSpec(Conditional, Gaffa.Action);
    Conditional.prototype.type = actionType;
    Conditional.prototype.condition = new Gaffa.Property();

    Conditional.prototype.trigger = function() {
        this.__super__.trigger.apply(this, arguments);

        if (this.condition.value) {
            this.gaffa.actions.trigger(action.actions['true'], action);
        } else {
            this.gaffa.actions.trigger(action.actions['false'], action);
        }           
    };
    
    
    
    return Conditional;
    
}));