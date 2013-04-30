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
        viewType = "checkbox";
    
    function Checkbox(){}
    Checkbox = Gaffa.createSpec(Checkbox, Gaffa.ContainerView);
    Checkbox.prototype.type = viewType;
    
    Checkbox.prototype.render = function(){
         var classes = viewType;
        
        var checkboxId = parseInt(Math.random() * 100000), //Dodgy as.... don't like it? submit a pull request.
            label,
            checkbox,
            renderedElement = crel('span',
                label = crel('label'),
                checkbox = crel('input', {'type': 'checkbox', 'id': checkboxId})
            );

        this.checkboxInput = checkbox;
        this.checkboxLabel = label;
        
        checkbox.addEventListener(this.updateEventName || "change", function(event){
            var viewModel = this.parentNode.viewModel;
            Gaffa.propertyUpdaters.bool(viewModel, viewModel.checked, this.checked);            
        });     
        label.setAttribute('for', checkboxId);
        renderedElement.appendChild(checkbox);
        renderedElement.appendChild(label);
        renderedElement.className = classes;
		
        this.views.content.element = label;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Checkbox.prototype.checked = new Gaffa.Property(function(viewModel, value) {
        viewModel.checkboxInput.checked = value;
    });

    Checkbox.prototype.text = new Gaffa.Property(function(viewModel, value){
        viewModel.checkboxLabel.textContent = (value && typeof value === 'string') ? value : null;
    });

    Checkbox.prototype.showLabel = new Gaffa.Property(function(viewModel, value){
        viewModel.checkboxLabel.style.display = value === false ? 'none' : null;
    });

    return Checkbox;
    
}));