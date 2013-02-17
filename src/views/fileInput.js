(function (undefined) {

    var gaffa = window.gaffa,
        viewType = "fileInput",
        cachedElement;
		
	gaffa.addDefaultStyle('.fileInput{position:relative; min-height:200px;background-color:white;border:solid 1px gray;}.fileInput:before{content:"Click to upload a file";text-align:center;padding-top:100px;position:absolute;top:0;left:0;right:0;bottom:0;opacity:.4;font-weight:bold;font-size:1.5em;}.fileInput input[type="file"]{position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;width:auto;height:auto}');
	
	function imageToBytes(image, callback) {
        var reader = new window.FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsBinaryString(image);
	}

    function setValue(event){    
        var input = this,
			viewModel = input.parentNode.viewModel;
                
        window.gaffa.model.set(viewModel.file.binding, input.files[0], viewModel);
		imageToBytes(input.files[0],function(bytes){
			window.gaffa.model.set(viewModel.bytes.binding, bytes, viewModel);		
		});
    }  
    
    function FileInput(){}
    FileInput = gaffa.createSpec(FileInput, gaffa.ContainerView);
    FileInput.prototype.type = viewType;
    FileInput.prototype.render = function(){
        var classes = viewType;

        var renderedElement = cachedElement || (function(){
				var input = document.createElement('input');
				
				input.type = 'file';
					
				cachedElement = document.createElement('div');
				
				cachedElement.appendChild(input);
				
				return cachedElement;
			})();

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
                
        $(renderedElement).on("change", 'input[type="file"]', setValue);
		
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    FileInput.prototype.file = new gaffa.Property();
    FileInput.prototype.bytes = new gaffa.Property();
    FileInput.prototype.disabled = new gaffa.Property(window.gaffa.propertyUpdaters.bool(function(viewModel, value){
        if (value){
            viewModel.renderedElement.setAttribute('disabled', 'disabled');
        }else{
            viewModel.renderedElement.removeAttribute('disabled');
        }
    }));
    
    gaffa.views[viewType] = FileInput;
    
})();
