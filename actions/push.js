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
        actionType = "push";
    
    function Push(){}
    Push = Gaffa.createSpec(Push, Gaffa.Action);
    Push.prototype.type = actionType;
    Push.prototype.trigger = function(){
        this.__super__.trigger.apply(this, arguments);
        
        var toObject = this.target.value;
        if(toObject == null){
            toObject = [];
            this.target.set(toObject);
        }
        if(Array.isArray(toObject)){
            var fromObj = this.source.value;
            if(!(this.clone && this.clone.value === false)){
                fromObj = this.gaffa.clone(fromObj);
            }
            var pushToBinding = new this.gaffa.Path(this.target.binding).append(toObject.length.toString());
            this.gaffa.model.set(pushToBinding, fromObj, this);
        }else{
            throw "Attempted to push to model property that was not an array, null, or undefined";
        }
    };
    Push.prototype.target = new Gaffa.Property();
    Push.prototype.source = new Gaffa.Property();
    
    

    return Push;

}));