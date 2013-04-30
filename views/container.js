(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var viewType = "container",
        crel = require('crel'),
        Gaffa = require('gaffa'),
		cachedElement;
    
    function Container(){
        this.views.content = new Gaffa.ViewContainer(this.views.content);
    }
    Container = Gaffa.createSpec(Container, Gaffa.ContainerView);
    Container.prototype.type = viewType;
    
    Container.prototype.render = function(){
        
        var renderedElement = crel(this.tagName || 'div');
        
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };

    return Container;
    
}));