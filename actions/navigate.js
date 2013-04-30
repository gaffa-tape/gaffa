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
        actionType = "navigate";
    
    function Navigate(){}
    Navigate = Gaffa.createSpec(Navigate, Gaffa.Action);
    Navigate.prototype.type = actionType;
    Navigate.prototype.url = new Gaffa.Property();
    Navigate.prototype.model = new Gaffa.Property();
    Navigate.prototype.post = new Gaffa.Property();
    Navigate.prototype.external = new Gaffa.Property();    
    Navigate.prototype.trigger = function() {
        this.__super__.trigger.apply(this, arguments);

        if(this.external.value){
            window.location = this.url.value;
            return;
        }
        Gaffa.navigate(this.url.value, this.model.value, this.post.value);
    }

    return Navigate;

}));