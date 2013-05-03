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
        viewType = "html";
        
    function Html(){}
    Html = Gaffa.createSpec(Html, Gaffa.View);
    Html.prototype.type = viewType;
    
    Html.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = crel('span');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Html.prototype.html = new Gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.innerHTML = (value && typeof value === 'string') ? value : null;
    });

    return Html;
    
}));