(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "pop";
    
    function Pop(){}
    Pop = gaffa.createSpec(Pop, gaffa.Action);
    Pop.prototype.type = actionType;
    Pop.prototype.trigger = function(){
        if(this.popFrom.value && this.popFrom.value.pop){
            var popFromArray = this.popFrom.value,
                poppedValue = popFromArray.pop();
                
            this.popTo.binding && gaffa.model.set(this.popTo.binding, poppedValue, this);
            gaffa.model.set(this.popFrom.binding, popFromArray, this);
        } 
    };
    Pop.prototype.target = new gaffa.Property();
    Pop.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Pop;
})();