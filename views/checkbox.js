(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-checkbox = factory();
    }
}(this, function(){
    "use strict";
    
    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = "checkbox";
    
    function Checkbox(){
        this.views.content = new gaffa.ViewContainer(this.views.content);
    }
    Checkbox = gaffa.createSpec(Checkbox, gaffa.ContainerView);
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
            gaffa.propertyUpdaters.bool(viewModel, viewModel.checked, this.checked);            
        });     
        label.setAttribute('for', checkboxId);
        renderedElement.appendChild(checkbox);
        renderedElement.appendChild(label);
        renderedElement.className = classes;
		
        this.views.content.element = label;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Checkbox.prototype.checked = new gaffa.Property(function(viewModel, value) {
        viewModel.checkboxInput.checked = value;
    });

    Checkbox.prototype.text = new gaffa.Property(function(viewModel, value){
        viewModel.checkboxLabel.textContent = (value && typeof value === 'string') ? value : null;
    });

    Checkbox.prototype.showLabel = new gaffa.Property(function(viewModel, value){
        viewModel.checkboxLabel.style.display = value === false ? 'none' : null;
    });
    
    gaffa.views[viewType] = Checkbox;

    return Checkbox;
    
}));