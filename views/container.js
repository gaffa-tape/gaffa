(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-container = factory();
    }
}(this, function(){
    var viewType = "container",
		cachedElement;
    
    function Container(){
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Container = gaffa.createSpec(Container, gaffa.ContainerView);
    Container.prototype.type = viewType;
    
    Container.prototype.render = function(){
        
        var renderedElement = crel(this.tagName || 'div');
        
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Container;
    
}));