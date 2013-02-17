(function (undefined) {

    var gaffa = window.gaffa,
        viewType = "imageInput",
        cachedElement;
		
	gaffa.addDefaultStyle('.imageInput{position:relative; min-height:200px;background-color:white;border:solid 1px gray;}.imageInput:before{content:"Click to upload a file";text-align:center;padding-top:100px;position:absolute;top:0;left:0;right:0;bottom:0;opacity:.4;font-weight:bold;font-size:1.5em;}.imageInput input[type="file"]{position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;width:auto;height:auto}');
	
	function imageToBytes(image, callback) {
        var reader = new window.FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsBinaryString(image);
	}            
	
	//http://stackoverflow.com/questions/961913/image-resize-before-upload
	//With a few mods of course..	
	function resizeImage(file, width, height, callback){
		var fileType = file.type,
		reader = new FileReader();

		reader.onloadend = function() {
		  var image = new Image();
			  image.src = reader.result;

		  image.onload = function() {
			var maxWidth = width || (!height && 200 || 0),
				maxHeight = height,
				imageWidth = image.width,
				imageHeight = image.height;

			if (imageWidth > imageHeight || !imageHeight) {
			  if (imageWidth > maxWidth) {
				imageHeight *= maxWidth / imageWidth;
				imageWidth = maxWidth;
			  }
			}
			else {
			  if (imageHeight > maxHeight || !imageWidth) {
				imageWidth *= maxHeight / imageHeight;
				imageHeight = maxHeight;
			  }
			}

			var canvas = document.createElement('canvas');
			canvas.width = imageWidth;
			canvas.height = imageHeight;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

			callback(canvas.toDataURL(fileType));
		  }
		}

		reader.readAsDataURL(file);
	}

    function setValue(event){    
        var input = this,
			viewModel = input.parentNode.viewModel,
			element = $(viewModel.renderedElement),
			properties = viewModel,
			image = input.files[0],
			setDataURL = function(file){
				window.gaffa.model.set(properties.dataURL.binding, file, viewModel);
			};
			
		properties.file.binding && window.gaffa.model.set(properties.file.binding, image, viewModel);
		properties.bytes.binding && imageToBytes(image,function(bytes){
			window.gaffa.model.set(properties.bytes.binding, bytes, viewModel);		
		});
		
		if(properties.maxWidth.value || properties.maxHeight.value && properties.dataURL.binding){
			element.addClass('resizing');
			resizeImage(image, properties.maxWidth.value, properties.maxHeight.value, function(file){
				setDataURL(file);
				element.removeClass('resizing');
			});
		}else{	
			properties.dataURL.binding && setDataURL(image);
		}
    }  
    
    function ImageInput(){}
    ImageInput = gaffa.createSpec(ImageInput, gaffa.ContainerView);
    ImageInput.prototype.type = viewType;
    
    ImageInput.prototype.render = function(){
        var classes = viewType;

        var renderedElement = cachedElement || (function(){
				var input = document.createElement('input');
				
				input.type = 'file';
				input.setAttribute('accept', 'image/*');
					
				cachedElement = document.createElement('div');
				
				cachedElement.appendChild(input);
				
				return cachedElement;
			})();

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
                
        $(renderedElement).on("change", 'input[type="file"]', setValue);
		
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;

        this.__super__.render.apply(this, arguments);
    }


    ImageInput.prototype.file = new gaffa.Property();
    ImageInput.prototype.bytes = new gaffa.Property();
    ImageInput.prototype.dataURL = new gaffa.Property();
    ImageInput.prototype.maxWidth = new gaffa.Property();
    ImageInput.prototype.maxHeight = new gaffa.Property();
    ImageInput.prototype.disabled = new gaffa.Property(window.gaffa.propertyUpdaters.bool(function(viewModel, value){
        if (value){
            viewModel.renderedElement.setAttribute('disabled', 'disabled');
        }else{
            viewModel.renderedElement.removeAttribute('disabled');
        }
    }));
    
    gaffa.views[viewType] = ImageInput;
	
})();