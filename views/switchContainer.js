(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
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
        
        this.__super__.render.apply(this, arguments);
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

        template = this.templates[value] || this.emptyTemplate;

        if(!template){
            content.add(createNewView(this, this.emptyTemplate, 'emptyTemplate'));
        }

        content.add(createNewView(this, template, 'templates-' + value));
    });

    return SwitchContainer;
    
}));