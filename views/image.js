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
        viewType = "image",
        crel = require('crel'),
		cachedElement;
        
    function imageToURI(image, callback) {
        var reader = new window.FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(image);
	}
    
    function Image(){}
    Image = Gaffa.createSpec(Image, Gaffa.View);
    Image.prototype.type = viewType;
    
    Image.prototype.render = function(){
        var renderedElement = crel('img');
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Image.prototype.source = new Gaffa.Property(Gaffa.propertyUpdaters.string(function (viewModel, value) {
        viewModel.renderedElement.setAttribute("src", value);
    }));
    
    Image.prototype.image = new Gaffa.Property(Gaffa.propertyUpdaters.object(function (viewModel, value) {
        if(!value){
            return;
        }
        if(typeof value === 'string'){
            viewModel.renderedElement.setAttribute("src", value);
        }else{
            imageToURI(value, function(dataURI){
                viewModel.renderedElement.setAttribute("src", dataURI);
            });
        }
    }));

    return Image;
    
}));