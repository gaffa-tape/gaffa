(function(undefined) {
    var viewType = "button",
		cachedElement;
        
    function Button(){
        this.type = viewType;
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Button = gaffa.createSpec(Button, gaffa.ContainerView);
    
    Button.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).addClass(classes)[0];
                
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Button.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.innerHTML = value;
        }else{
            viewModel.renderedElement.innerHTML = "";
        }
    }));
    
    Button.prototype.subtype = new gaffa.Property(window.gaffa.propertyUpdaters.string("subType", function(viewModel, value){
        viewModel.renderedElement.setAttribute("type", value || 'button');
    }));
    
    Button.prototype.disabled = new gaffa.Property(window.gaffa.propertyUpdaters.bool("disabled", function(viewModel, value){
        if(value){
            viewModel.renderedElement.setAttribute("disabled", "disabled");
        }else{
            viewModel.renderedElement.removeAttribute("disabled");					
        }
    }));
    
    gaffa.views[viewType] = Button;
    
})();