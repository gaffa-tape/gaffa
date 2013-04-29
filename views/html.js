(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-html = factory();
    }
}(this, function(){
    "use strict";
    
    var gaffa = window.gaffa,
        crel = gaffa.crel,
        viewType = "html";
        
    function Html(){}
    Html = gaffa.createSpec(Html, gaffa.View);
    Html.prototype.type = viewType;
    
    Html.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = document.createElement('span');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Html.prototype.html = new gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.innerHTML = (value && typeof value === 'string') ? value : null;
    });
    
    gaffa.views[viewType] = Html;

    return Html;
    
}));