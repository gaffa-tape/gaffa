(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-pop = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        actionType = "pop";
    
    function Pop(){}
    Pop = gaffa.createSpec(Pop, gaffa.Action);
    Pop.prototype.type = actionType;
    Pop.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        if(this.source.value && this.source.value.pop){
            var popFrom = this.source.value,
                poppedValue = popFrom.pop();
                
            this.target.binding && gaffa.model.set(this.target.binding, poppedValue, this);
            gaffa.model.set(this.source.binding, popFromArray, this);
        } 
    };
    Pop.prototype.target = new gaffa.Property();
    Pop.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Pop;

    return Pop;

}));