(function(undefined) {
    var viewType = "image",
		cachedElement;
        
    function imageToURI(image, callback) {
        var reader = new window.FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(image);
	}
    
    function Image(){}
    Image = gaffa.createSpec(Image, gaffa.View);
    Image.prototype.type = viewType;
    
    Image.prototype.render = function(){
        var classes = viewType;

        var renderedElement = $(document.createElement('img')).addClass(classes)[0];
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Image.prototype.source = new gaffa.Property(window.gaffa.propertyUpdaters.string(function (viewModel, value) {
        viewModel.renderedElement.setAttribute("src", value);
    }));
    
    Image.prototype.image = new gaffa.Property(window.gaffa.propertyUpdaters.object(function (viewModel, value) {
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
    
    gaffa.views[viewType] = Image;
    
})();