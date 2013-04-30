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
        actionType = "pop";
    
    function Pop(){}
    Pop = Gaffa.createSpec(Pop, Gaffa.Action);
    Pop.prototype.type = actionType;
    Pop.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        if(this.source.value && this.source.value.pop){
            var popFrom = this.source.value,
                poppedValue = popFrom.pop();
                
            this.target.binding && gaffa.model.set(this.target.binding, poppedValue, this);
            this.source.set(popFromArray, this);
        } 
    };
    Pop.prototype.target = new Gaffa.Property();
    Pop.prototype.source = new Gaffa.Property();
    
    

    return Pop;

}));