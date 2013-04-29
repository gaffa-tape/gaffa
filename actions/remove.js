(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-remove = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        actionType = "remove";
    
    function Remove(){}
    Remove = gaffa.createSpec(Remove, gaffa.Action);
    Remove.prototype.type = actionType;
    Remove.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        gaffa.model.remove(this.target.binding, this);
    };
    Remove.prototype.target = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Remove;

    return Remove;

}));