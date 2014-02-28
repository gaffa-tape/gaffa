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

};

Image.prototype.source = new Gaffa.Property(function (viewModel, value) {
    viewModel.renderedElement[value ? 'setAttribute' : 'removeAttribute']('src', value);
});

Image.prototype.image = new Gaffa.Property(function (viewModel, value) {
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
});

module.exports = Image;