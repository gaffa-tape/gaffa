"use strict";

var Gaffa = require('gaffa'),
    crel = require('crel');

function Checkbox(){}
Checkbox = Gaffa.createSpec(Checkbox, Gaffa.ContainerView);
Checkbox.prototype.type = 'checkbox';

Checkbox.prototype.render = function(){
    var view = this,
        label,
        checkbox,
        renderedElement = crel('span',
            label = crel('label'),
            checkbox = crel('input', {'type': 'checkbox'})
        );

    this.checkboxInput = checkbox;
    this.checkboxLabel = label;

    checkbox.addEventListener(this.updateEventName || "change", function(event){
        view.checked.set(this.checked);
    });
    label.addEventListener('click', function(){
        checkbox.click();
    });
    renderedElement.appendChild(checkbox);
    renderedElement.appendChild(label);

    this.views.content.element = label;

    this.renderedElement = renderedElement;


};

Checkbox.prototype.checked = new Gaffa.Property(function(view, value) {
    view.checkboxInput.checked = value;
});

Checkbox.prototype.text = new Gaffa.Property(function(view, value){
    view.checkboxLabel.textContent = (value && typeof value === 'string') ? value : null;
});

Checkbox.prototype.showLabel = new Gaffa.Property(function(view, value){
    view.checkboxLabel.style.display = value === false ? 'none' : null;
});

module.exports = Checkbox;