(function (undefined) {
    var actionType = "conditional";
    
    function Conditional(){}
    Conditional = gaffa.createSpec(Conditional, gaffa.Action);
    Conditional.prototype.type = actionType;
    Conditional.prototype.trigger = function(){
        trigger(this);
    };
    Conditional.prototype.condition = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Conditional;
    
    function trigger(action) {
        if (action.condition.value) {
            window.gaffa.actions.trigger(action.actions['true'], action);
        } else {
            window.gaffa.actions.trigger(action.actions['false'], action);
        }           
    };
})();