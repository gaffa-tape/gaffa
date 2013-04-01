(function(undefined) {
    "use strict";
    
    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = "button";
        
    function Button(){}
    Button = gaffa.createSpec(Button, gaffa.ContainerView);
    Button.prototype.type = viewType;
    
    Button.prototype.render = function(){        
        var renderedElement = crel('button');
                
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Button.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.innerHTML = value;
        }else{
            viewModel.renderedElement.innerHTML = "";
        }
    }));
    
    Button.prototype.subType = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.setAttribute("type", value || 'button');
    }));
    
    Button.prototype.disabled = new gaffa.Property(window.gaffa.propertyUpdaters.bool(function(viewModel, value){
        if(value){
            viewModel.renderedElement.setAttribute("disabled", "disabled");
        }else{
            viewModel.renderedElement.removeAttribute("disabled");					
        }
    }));
    
    gaffa.views[viewType] = Button;
    
})();