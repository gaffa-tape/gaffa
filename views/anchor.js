(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    "use strict";

    var Gaffa = require('gaffa'),
        crel = require('crel'),
        doc = require('doc-js'),
        viewType = "anchor",
		cachedElement;
    
    function Anchor(){
    }
    Anchor = Gaffa.createSpec(Anchor, Gaffa.ContainerView);
    Anchor.prototype.type = viewType;
    
    Anchor.prototype.render = function(){
        var renderedElement = crel('a'),
            viewModel = this;

        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;

        if(!this.external){
            doc.on('click', renderedElement, function(event){
                event.preventDefault();
                viewModel.gaffa.navigate(viewModel.href.value, viewModel.target.value);
            });
        }
        
        this.__super__.render.apply(this, arguments);
    };
    
    Anchor.prototype.text = new Gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.textContent = (value && typeof value === 'string') ? value : null;
    });
    
    Anchor.prototype.target = new Gaffa.Property(function(viewModel, value){
        if(typeof value === 'string'){
            viewModel.renderedElement.setAttribute('target', value);
        }else{
            viewModel.renderedElement.removeAttribute('target');
        }
    });

    Anchor.prototype.href = new Gaffa.Property(function(viewModel, value){
        if(value !== null && value !== undefined){
            viewModel.renderedElement.setAttribute("href",value);
        }else{
            viewModel.renderedElement.removeAttribute("href");
        }
    });

    return Anchor;
    
}));