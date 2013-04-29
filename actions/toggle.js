(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-toggle = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        actionType = "toggle";
    
    function Toggle(){}
    Toggle = gaffa.createSpec(Toggle, gaffa.Action);
    Toggle.prototype.type = actionType;
    Toggle.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);

        gaffa.model.set(this.target.binding, !this.target.value, this);
    };
    Toggle.prototype.target = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Toggle;

    return Toggle;

}));