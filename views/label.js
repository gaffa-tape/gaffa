(function(undefined) {
    "use strict";
    
    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = 'label';
        
    function Label(){}
    Label = gaffa.createSpec(Label, gaffa.View);
    Label.prototype.type = viewType;
    
    Label.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = crel('label');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Label.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.textContent = value || "";
    }));
    
    Label.prototype.labelFor = new gaffa.Property(window.gaffa.propertyUpdaters.string(function (viewModel, value) {
        if (value === null || value === undefined) {
            viewModel.renderedElement.setAttribute("labelFor", value);
        } else {
            viewModel.renderedElement.removeAttribute("labelFor");
        }
    }));
    
    gaffa.views[viewType] = Label;
    
})();