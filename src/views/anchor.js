(function(undefined) {
    var gaffa = window.gaffa,
        viewType = "anchor",
		cachedElement;
    
    function Anchor(){
    }
    Anchor = gaffa.createSpec(Anchor, gaffa.ContainerView);
    Anchor.prototype.type = viewType;
    
    Anchor.prototype.render = function(){
        var classes = viewType;

        var renderedElement = $(document.createElement('a')).addClass(classes)[0];

        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Anchor.prototype.text = new gaffa.Property(gaffa.propertyUpdaters.string(function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.innerHTML = value;
        }else{
            viewModel.renderedElement.innerHTML = "";
        }
    }));
    Anchor.prototype.href = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.setAttribute("href",value);
        }else{
            viewModel.renderedElement.removeAttribute("href");
        }
    }));
    
    gaffa.views[viewType] = Anchor;
    
})();