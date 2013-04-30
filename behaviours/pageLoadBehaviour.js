(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa');

    function PageLoadBehaviour(){}
    PageLoadBehaviour = createSpec(PageLoadBehaviour, Gaffa.Behaviour);
    PageLoadBehaviour.prototype.bind = function(){
        Gaffa.Behaviour.prototype.bind.apply(this, arguments);
        
        this.gaffa.actions.trigger(this.actions.load, this);
    };

    return PageLoadBehaviour;
}));