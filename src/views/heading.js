(function(undefined) {
    var viewType = "heading",
		cachedElement;
        
    function Heading(){    }
    Heading = gaffa.createSpec(Heading, gaffa.View);
    Heading.prototype.type = viewType;
    
    Heading.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement(this.level || 'h1')).addClass(classes)[0];
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Heading.prototype.text = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        if(typeof value === "string"){
            viewModel.renderedElement.innerHTML = value;
        }else{
            viewModel.renderedElement.innerHTML = "";
        }
    }));
    
    gaffa.views[viewType] = Heading;
    
})();