(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "set";
    
    function Set(){}
    Set = gaffa.createSpec(Set, gaffa.Action);
    Set.prototype.type = actionType;
    Set.prototype.trigger = function(){
        trigger(this);
    };
    Set.prototype.target = new gaffa.Property();
    Set.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Set;
    
    function trigger(action) {
        var fromObj = action.source.value;
        if(!(action.clone && action.clone.value === false)){
            fromObj = gaffa.clone(fromObj);
        }
        window.gaffa.model.set(action.target.binding, fromObj, action);            
    };
})();