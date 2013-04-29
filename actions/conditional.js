(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-conditional = factory();
    }
}(this, function(){
    var actionType = "conditional";
    
    function Conditional(){}
    Conditional = gaffa.createSpec(Conditional, gaffa.Action);
    Conditional.prototype.type = actionType;
    Conditional.prototype.condition = new gaffa.Property();

    Conditional.prototype.trigger = function() {
        this.__super__.trigger.apply(this, arguments);

        if (action.condition.value) {
            window.gaffa.actions.trigger(action.actions['true'], action);
        } else {
            window.gaffa.actions.trigger(action.actions['false'], action);
        }           
    };
    
    window.gaffa.actions[actionType] = Conditional;
    
    return Conditional;
    
}));