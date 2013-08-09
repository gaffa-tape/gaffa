"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "button";
    
function Button(){}
Button = Gaffa.createSpec(Button, Gaffa.ContainerView);
Button.prototype.type = viewType;

Button.prototype.render = function(){        
    var renderedElement = crel('button');
            
    this.views.content.element = renderedElement;
    
    this.renderedElement = renderedElement;
    
    this.__super__.render.apply(this, arguments);
};

Button.prototype.text = new Gaffa.Property(function(viewModel, value){
    if(value !== null && value !== undefined){
        viewModel.renderedElement.innerHTML = value;
    }else{
        viewModel.renderedElement.innerHTML = "";
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