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
        viewType = "text",
        findShitBrowsersRegex = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        
    function Text(){}
    Text = Gaffa.createSpec(Text, Gaffa.View);
    Text.prototype.type = viewType;
    
    Text.prototype.render = function(){
        var classes = viewType,
            renderedElement;
        
        renderedElement = document.createElement('span');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Text.prototype.text = new Gaffa.Property(function(viewModel, value){
        if(!shit){
            viewModel.renderedElement.data = value;
            if(value !== null && value !== undefined){
                viewModel.renderedElement.data = value;
            }else{
                viewModel.renderedElement.data = "";
            }
        }else{
            if(value !== null && value !== undefined){
                viewModel.renderedElement.innerHTML = value;
            }else{
                viewModel.renderedElement.innerHTML = "";
            }
        }
    });
    
    Text.prototype.visible = new Gaffa.Property(function(viewModel, value){
        var element = viewModel.renderedElement;

        if(!shit){
            viewModel.renderedElement.data = value === false ? '' : viewModel.text.value;
        }else{
            viewModel.renderedElement.style.display = value === false ? 'none' : null;            
        }
    });

    return Text;
    
}));