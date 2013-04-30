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
        viewType = "textarea",
		cachedElement;
        
    function setValue(event){
        var textArea = this;
        
        var matchFail = function(){
            $(textArea).addClass('error');
        }
        
        Gaffa.propertyUpdaters.string(textArea.viewModel, textArea.viewModel.value, $(textArea).val(), matchFail); 
    }
        
    function Textarea(){}
    Textarea = Gaffa.createSpec(Textarea, Gaffa.View);
    Textarea.prototype.type = viewType;
    
    Textarea.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = document.createElement('textarea');
        renderedElement.className = classes;        
        
        $(renderedElement).on(this.updateEventName || "change", setValue);
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Textarea.prototype.value = new Gaffa.Property(Gaffa.propertyUpdaters.string(function(viewModel, value){
        $(viewModel.renderedElement).val(value);
    }));
    
    Textarea.prototype.placeholder = new Gaffa.Property(Gaffa.propertyUpdaters.string(function(viewModel, value){
        $(viewModel.renderedElement).attr('placeholder', value);
    }));
    
    Textarea.prototype.disabled = new Gaffa.Property(Gaffa.propertyUpdaters.bool(function(viewModel, value){
        if (value){
            viewModel.renderedElement.setAttribute('disabled', 'disabled');
        }else{
            viewModel.renderedElement.removeAttribute('disabled');
        }
    }));

    return Textarea;
    
}));