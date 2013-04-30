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
        actionType = "fromJson";
    
    function FromJson(){}
    FromJson = Gaffa.createSpec(FromJson, Gaffa.Action);
    FromJson.prototype.type = actionType;
    FromJson.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        this.target.set(JSON.parse(this.source.value), this);
    };
    FromJson.prototype.target = new Gaffa.Property();
    FromJson.prototype.source = new Gaffa.Property();
    
    

    return FromJson;

}));