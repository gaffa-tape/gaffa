(function(undefined) {
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
    
})();