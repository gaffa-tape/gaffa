(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-heading = factory();
    }
}(this, function(){
    "use strict";
    
    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = "heading";
        
    function Heading(){    }
    Heading = gaffa.createSpec(Heading, gaffa.View);
    Heading.prototype.type = viewType;
    
    Heading.prototype.render = function(){        
        var renderedElement = crel('h' + (parseInt(this.level) || 1));
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Heading.prototype.text = new gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.textContent = (value && typeof value === 'string') ? value : null;
    });
    
    gaffa.views[viewType] = Heading;

    return Heading;
    
}));