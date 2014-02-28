"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "button";

function Button(){}
Button = Gaffa.createSpec(Button, Gaffa.ContainerView);
Button.prototype.type = viewType;

Button.prototype.render = function(){
    var textNode = document.createTextNode(''),
        renderedElement = crel('button', textNode);

    this.views.content.element = renderedElement;

    this.text.textNode = textNode;

    this.renderedElement = renderedElement;

};

Button.prototype.text = new Gaffa.Property(function(view, value){
    if(value !== null && value !== undefined){
        this.textNode.textContent = value;
    }else{
        this.textNode.textContent = '';
    }
});

Button.prototype.subType = new Gaffa.Property(function(viewModel, value){
    viewModel.renderedElement.setAttribute("type", value || 'button');
});

Button.prototype.disabled = new Gaffa.Property(function(viewModel, value){
    if(value){
        viewModel.renderedElement.setAttribute("disabled", "disabled");
    }else{
        viewModel.renderedElement.removeAttribute("disabled");
    }
});

module.exports = Button;