var Gaffa = require('gaffa'),
    crel = require('crel'),
    doc = require('doc-js'),
    viewType = "fileInput";

function setValue(event){
    var input = event.target,
        viewModel = input.viewModel;

    viewModel.files.set(Array.prototype.slice.call(input.files), viewModel);
    viewModel.triggerActions('change');
}

function FileInput(){}
FileInput = Gaffa.createSpec(FileInput, Gaffa.View);
FileInput.prototype.type = viewType;
FileInput.prototype.render = function(){
    var classes = viewType;

    var renderedElement = crel('input');

    renderedElement.type = 'file';

    doc.on("change", 'input[type="file"]', setValue, renderedElement);

    this.renderedElement = renderedElement;

    this.__super__.render.apply(this, arguments);
};
FileInput.prototype.multiple = new Gaffa.Property(function(viewModel, value){
    if (value){
        viewModel.renderedElement.setAttribute('multiple', null);
    }else{
        viewModel.renderedElement.removeAttribute('multiple');
    }
});
FileInput.prototype.files = new Gaffa.Property();
FileInput.prototype.accept = new Gaffa.Property(function(viewModel, value){
    if (value){
        viewModel.renderedElement.setAttribute('accept', value);
    }else{
        viewModel.renderedElement.removeAttribute('accept');
    }
});
FileInput.prototype.disabled = new Gaffa.Property(function(viewModel, value){
    if (value){
        viewModel.renderedElement.setAttribute('disabled', 'disabled');
    }else{
        viewModel.renderedElement.removeAttribute('disabled');
    }
});

module.exports = FileInput;