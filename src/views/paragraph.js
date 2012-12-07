(function(undefined) {
    var viewType = "paragraph",
		cachedElement;
    
    function Paragraph(){
        this.type = viewType;
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Paragraph = gaffa.createSpec(Paragraph, gaffa.ContainerView);
    
    Paragraph.prototype.render = function(){
        var classes = viewType;

        var renderedElement = document.createElement('p');
        renderedElement.className = classes;

        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Paragraph;
    
})();