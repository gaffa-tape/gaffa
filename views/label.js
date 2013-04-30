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
        viewType = 'label';
        
    function Label(){}
    Label = Gaffa.createSpec(Label, Gaffa.View);
    Label.prototype.type = viewType;
    
    Label.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = crel('label');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Label.prototype.text = new Gaffa.Property(Gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.textContent = value || "";
    }));
    
    Label.prototype.labelFor = new Gaffa.Property(Gaffa.propertyUpdaters.string(function (viewModel, value) {
        if (value === null || value === undefined) {
            viewModel.renderedElement.setAttribute("labelFor", value);
        } else {
            viewModel.renderedElement.removeAttribute("labelFor");
        }
    }));

    return Label;
    
}));