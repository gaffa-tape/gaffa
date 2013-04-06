(function (undefined) {
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
    
    
})();