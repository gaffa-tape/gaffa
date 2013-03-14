(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "set";
    
    function Set(){}
    Set = gaffa.createSpec(Set, gaffa.Action);
    Set.prototype.type = actionType;
    Set.prototype.trigger = function(){
        var fromObj = this.source.value;
        if(!(this.clone && this.clone.value === false)){
            fromObj = gaffa.clone(fromObj);
        }
        window.gaffa.model.set(this.target.binding, fromObj, this); 
    };
    Set.prototype.target = new gaffa.Property();
    Set.prototype.source = new gaffa.Property();
    Set.prototype.clone = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Set;
})();