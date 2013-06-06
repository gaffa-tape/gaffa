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
        actionType = "clean";
    
    function Clean(){}
    Clean = Gaffa.createSpec(Clean, Gaffa.Action);
    Clean.prototype.type = actionType;
    Clean.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        this.gaffa.model.setDirtyState(this.target.binding, false, this); 
    };
    Clean.prototype.target = new Gaffa.Property();

    return Clean;

}));