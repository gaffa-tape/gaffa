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
        viewType = "text";
        
    function Text(){}
    Text = Gaffa.createSpec(Text, Gaffa.View);
    Text.prototype.type = viewType;
    
    Text.prototype.render = function(){        
        this.renderedElement = document.createTextNode('');
        
        this.__super__.render.apply(this, arguments);
    };
    
    Text.prototype.text = new Gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.data = value || '';
    });
    
    Text.prototype.visible = new Gaffa.Property(function(viewModel, value){
        viewModel.renderedElement.data = (value === false ? '' : viewModel.text.value || '');
    });

    return Text;
    
}));