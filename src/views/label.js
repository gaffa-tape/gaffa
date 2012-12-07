(function(undefined) {
    var viewType = "label",
		cachedElement;
        
    function Label(){
        this.type = viewType;
    }
    Label = gaffa.createSpec(Label, gaffa.View);
    
    Label.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('label')).addClass(classes)[0];
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Label.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
        viewModel.renderedElement.innerHTML = value || "";
    }));
    
    Label.prototype.labelFor = new gaffa.Property(window.gaffa.propertyUpdaters.string("labelFor", function (viewModel, value) {
        if (value === null || value === undefined) {
            viewModel.renderedElement.setAttribute("labelFor", value);
        } else {
            viewModel.renderedElement.removeAttribute("labelFor");
        }
    }));
    
    gaffa.views[viewType] = Label;
    
})();