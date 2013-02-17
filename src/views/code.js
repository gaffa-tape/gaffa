(function(undefined) {
    var gaffa = window.gaffa,
        viewType = "code";
    
    if (navigator.appName == 'Microsoft Internet Explorer'&&
        parseFloat(findShitBrowsersRegex.exec(navigator.userAgent)[1])<9
    ){
        shit = true;
    }
        
    function Code(){}
    Code = gaffa.createSpec(Code, gaffa.View);
    Code.prototype.type = viewType;
    
    Code.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0')[0];
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Code.prototype.code = new gaffa.Property(window.gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.innerText = value;
    }));
    
    gaffa.views[viewType] = Code;
    
})();