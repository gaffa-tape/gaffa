(function(undefined) {
    var viewType = "textarea",
		cachedElement;
        
    function setValue(event){
        var textArea = this;
        
        var matchFail = function(){
            $(textArea).addClass('error');
        }
        
        window.gaffa.propertyUpdaters.string(textArea.viewModel, textArea.viewModel.value, $(textArea).val(), matchFail); 
    }
        
    function Textarea(){}
    Textarea = gaffa.createSpec(Textarea, gaffa.View);
    Textarea.prototype.type = viewType;
    
    Textarea.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = document.createElement('textarea');
        renderedElement.className = classes;        
        
        $(renderedElement).on(this.updateEventName || "change", setValue);
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Textarea.prototype.value = new gaffa.Property(window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
        $(viewModel.renderedElement).val(value);
    }));
    
    Textarea.prototype.placeholder = new gaffa.Property(window.gaffa.propertyUpdaters.string("placeholder", function(viewModel, value){
        $(viewModel.renderedElement).attr('placeholder', value);
    }));
    
    Textarea.prototype.disabled = new gaffa.Property(window.gaffa.propertyUpdaters.bool("disabled", function(viewModel, value){
        if (value){
            viewModel.renderedElement.setAttribute('disabled', 'disabled');
        }else{
            viewModel.renderedElement.removeAttribute('disabled');
        }
    }));
    
    gaffa.views[viewType] = Textarea;
    
})();