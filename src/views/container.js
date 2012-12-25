(function(undefined) {
    var viewType = "container",
		cachedElement;
    
    function Container(){
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Container = gaffa.createSpec(Container, gaffa.ContainerView);
    Container.prototype.type = viewType;
    
    Container.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = (cachedElement = cachedElement || document.createElement('div'));
		renderedElement = renderedElement.cloneNode(true);
        renderedElement.className = classes;
        
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Container;
    
})();