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
        actionType = "set";
    
    function Set(){}
    Set = Gaffa.createSpec(Set, Gaffa.Action);
    Set.prototype.type = actionType;
    Set.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        var fromObj = this.source.value;
        if(!(this.clone && this.clone.value === false)){
            fromObj = gaffa.clone(fromObj);
        }
        this.target.set(fromObj, !this.cleans.value); 
    };
    Set.prototype.target = new Gaffa.Property();
    Set.prototype.source = new Gaffa.Property();
    Set.prototype.clone = new Gaffa.Property();
    Set.prototype.cleans = new Gaffa.Property();

    return Set;

}));