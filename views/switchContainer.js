var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "switchContainer",
	cachedElement;

function SwitchContainer(){}
SwitchContainer = Gaffa.createSpec(SwitchContainer, Gaffa.ContainerView);
SwitchContainer.prototype.type = viewType;

SwitchContainer.prototype.render = function(){

    var renderedElement = crel(this.tagName || 'div');

    this.views.content.element = renderedElement;
    this.renderedElement = renderedElement;

};

function createNewView(property, template, templateKey){
    if(!property.templateCache){
        property.templateCache= {};
    }
    var view = JSON.parse(
        property.templateCache[templateKey] ||
        (property.templateCache[templateKey] = JSON.stringify(template))
    );

    return property.gaffa.initialiseViewItem(view, property.gaffa, property.gaffa.views.constructors);
}

SwitchContainer.prototype.content = new Gaffa.Property(function(viewModel, value){
    var template,
        content = viewModel.views.content;

    // remove old view
    while(content.length){
        content[0].remove();
    }

    template = this.templates && this.templates[value] || this.emptyTemplate;

    if(!template){
        if(this.emptyTemplate){
            content.add(createNewView(this, this.emptyTemplate, 'emptyTemplate'));
        }
        return;
    }

    content.add(createNewView(this, template, 'templates-' + value));
});

module.exports = SwitchContainer;