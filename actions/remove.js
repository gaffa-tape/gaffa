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
        actionType = "remove";
    
    function Remove(){}
    Remove = Gaffa.createSpec(Remove, Gaffa.Action);
    Remove.prototype.type = actionType;
    Remove.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        this.gaffa.model.remove(this.target.binding, this);
    };
    Remove.prototype.target = new Gaffa.Property();
    
    

    return Remove;

}));