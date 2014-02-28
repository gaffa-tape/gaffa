"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "anchor",
	cachedElement;

function Anchor(){
}
Anchor = Gaffa.createSpec(Anchor, Gaffa.ContainerView);
Anchor.prototype.type = viewType;

Anchor.prototype.render = function(){
    var textNode = document.createTextNode(''),
        renderedElement = crel('a',textNode),
        viewModel = this;

    this.views.content.element = renderedElement;

    this.renderedElement = renderedElement;

    this.text.textNode = textNode;

    if(!this.external){
        // Prevent default click action reguardless of gaffa.event implementation
        renderedElement.onclick = function(event){
            if(event.which === 1){
                event.preventDefault()
            }
        };

        this.gaffa.events.on('click', renderedElement, function(event){
            if(event.which === 1){
                viewModel.gaffa.navigate(viewModel.href.value, viewModel.target.value);
            }
        });
    }
};

Anchor.prototype.text = new Gaffa.Property(function(view, value){
    if(value !== null && value !== undefined){
        this.textNode.textContent = value;
    }else{
        this.textNode.textContent = '';
    }
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

module.exports = Anchor;