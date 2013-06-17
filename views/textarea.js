(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        crel = require('crel'),
        doc = require('doc-js'),
        viewType = "textarea",
		cachedElement;
        
    function Textarea(){}
    Textarea = Gaffa.createSpec(Textarea, Gaffa.View);
    Textarea.prototype.type = viewType;
    
    Textarea.prototype.render = function(){        
        var view = this,
            renderedElement = crel('textarea');
        
        doc.on(this.updateEventName || "change", renderedElement, function(){
            view.value.set(renderedElement.value);
        });
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Textarea.prototype.value = new Gaffa.Property(Gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.value = value;
    }));
    
    Textarea.prototype.placeholder = new Gaffa.Property(Gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement[value ? 'setAttribute' : 'removeAttribute']('placeholder', value);

    }));
    
    Textarea.prototype.disabled = new Gaffa.Property(Gaffa.propertyUpdaters.bool(function(viewModel, value){
        viewModel.renderedElement[value ? 'setAttribute' : 'removeAttribute']('disabled', value);
    }));

    return Textarea;
    
}));