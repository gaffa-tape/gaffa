(function(undefined) {
    var viewType = "text",
        shit,
        findShitBrowsersRegex = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    
    if (navigator.appName == 'Microsoft Internet Explorer'&&
        parseFloat(findShitBrowsersRegex.exec(navigator.userAgent)[1])<9
    ){
        shit = true;
    }
        
    function Text(){}
    Text = gaffa.createSpec(Text, gaffa.View);
    Text.prototype.type = viewType;
    
    Text.prototype.render = function(){
        var classes = viewType,
            renderedElement;
        
        //Internet expoder, as usual, is FUCKING SHIT.
        //and won't let you add values to textNode elements.
        if(!shit){
            renderedElement = document.createTextNode('');
        }else{
            renderedElement = document.createElement('span');
        }
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Text.prototype.text = new gaffa.Property(function(viewModel, value){
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
    
    Text.prototype.visible = new gaffa.Property(function(viewModel, value){
        var element = viewModel.renderedElement;

        if(!shit){
            viewModel.renderedElement.data = value === false ? '' : viewModel.text.value;
        }else{
            viewModel.renderedElement.style.display = value === false ? 'none' : null;            
        }
    });
    
    gaffa.views[viewType] = Text;
    
})();