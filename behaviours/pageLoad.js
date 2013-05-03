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
        behaviourType = 'pageLoad';

    function PageLoadBehaviour(){}
    PageLoadBehaviour = Gaffa.createSpec(PageLoadBehaviour, Gaffa.Behaviour);
    PageLoadBehaviour.prototype.type = behaviourType;
    PageLoadBehaviour.prototype.bind = function(){
        Gaffa.Behaviour.prototype.bind.apply(this, arguments);
        
        this.gaffa.actions.trigger(this.actions.load, this);
    };

    return PageLoadBehaviour;
}));