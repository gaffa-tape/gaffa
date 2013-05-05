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
        actionType = "forEach";
    
    function ForEach(){}
    ForEach = Gaffa.createSpec(ForEach, Gaffa.Action);
    ForEach.prototype.type = actionType;
    ForEach.prototype.target = new Gaffa.Property();

    ForEach.prototype.trigger = function() {
        this.__super__.trigger.apply(this, arguments);

        var items = this.target.value;

        if(!items){
            return;
        }

        var keys = items.__gaffaKeys__;

        for(var i = 0; i < items.length; i++){
            this.key = keys ? keys[i] : '' + i;
            this.gaffa.actions.trigger(this.actions['forEach'], this);
        }

        this.key = null;
    };
    
    
    
    return ForEach;
    
}));