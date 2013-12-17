var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "text";
    
function Text(){}
Text = Gaffa.createSpec(Text, Gaffa.View);
Text.prototype.type = viewType;

Text.prototype.render = function(){        
    this.renderedElement = document.createTextNode('');
    
    this.__super__.render.apply(this, arguments);
};

Text.prototype.text = new Gaffa.Property(function(viewModel, value){
    viewModel.renderedElement.data = value || '';
});

Text.prototype.visible = new Gaffa.Property(function(viewModel, value){
    viewModel.renderedElement.data = (value === false ? '' : viewModel.text.value || '');
});

Text.prototype.title = undefined;
Text.prototype.enabled = undefined;
Text.prototype.classes = undefined;

module.exports = Text;