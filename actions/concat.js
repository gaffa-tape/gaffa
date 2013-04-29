(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-concat = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        actionType = "concat";
    
    function Concat(){}
    Concat = gaffa.createSpec(Concat, gaffa.Action);
    Concat.prototype.type = actionType;
    Concat.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        var target = this.target.value,
            source = this.source.value
            
            
        if(source && source.slice){
            source = source.slice();
        }
            
        if(target && target.concat){
            if(Array.isArray(target) && !(this.clone && this.clone.value === false)){
                fastEach(source, function(item, index){
                    source[index] = gaffa.clone(item);
                });
            }        
            window.gaffa.model.set(this.target.binding, this.target.value.concat(source), this); 
        }   
    };
    Concat.prototype.target = new gaffa.Property();
    Concat.prototype.source = new gaffa.Property();
    Concat.prototype.clone = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Concat;

    return Concat;

}));