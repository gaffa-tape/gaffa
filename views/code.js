var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "code";

function Code(){}
Code = Gaffa.createSpec(Code, Gaffa.View);
Code.prototype.type = viewType;

Code.prototype.render = function(){
    var renderedElement = crel('code', {'tabindex':0});

    this.renderedElement = renderedElement;

};

Code.prototype.code = new Gaffa.Property(function(viewModel, value){
    viewModel.renderedElement.innerText = value;
});

module.exports = Code;