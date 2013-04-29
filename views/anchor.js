(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-anchor = factory();
    }
}(this, function(){
    "use strict";

    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = "anchor",
		cachedElement;
    
    function Anchor(){
    }
    Anchor = gaffa.createSpec(Anchor, gaffa.ContainerView);
    Anchor.prototype.type = viewType;
    
    Anchor.prototype.render = function(){
        var renderedElement = crel('a');

        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Anchor.prototype.text = new gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.textContent = (value && typeof value === 'string') ? value : null;
    });

    Anchor.prototype.href = new gaffa.Property(function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.setAttribute("href",value);
        }else{
            viewModel.renderedElement.removeAttribute("href");
        }
    });
    
    gaffa.views[viewType] = Anchor;

    return Anchor
    
}));