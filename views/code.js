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
        viewType = "code";
    
    if (navigator.appName == 'Microsoft Internet Explorer'&&
        parseFloat(findShitBrowsersRegex.exec(navigator.userAgent)[1])<9
    ){
        shit = true;
    }
        
    function Code(){}
    Code = Gaffa.createSpec(Code, Gaffa.View);
    Code.prototype.type = viewType;
    
    Code.prototype.render = function(){        
        var renderedElement = crel('code', {'tabindex':0});
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Code.prototype.code = new Gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.innerText = value;
    });

    return Code
    
}));