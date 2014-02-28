var Gaffa = require('gaffa'),
    crel = require('crel'),
    doc = require('doc-js'),
    viewType = "textarea",
	cachedElement;

function Textarea(){}
Textarea = Gaffa.createSpec(Textarea, Gaffa.View);
Textarea.prototype.type = viewType;

Textarea.prototype.render = function(){
    var view = this,
        renderedElement = crel('textarea');

    doc.on(this.updateEventName || "change", renderedElement, function(){
        view.value.set(renderedElement.value);
    });

    this.renderedElement = renderedElement;

};

Textarea.prototype.value = new Gaffa.Property(function(view, value){
    view.renderedElement.value = value || '';
});

Textarea.prototype.placeholder = new Gaffa.Property(function(view, value){
    view.renderedElement[value ? 'setAttribute' : 'removeAttribute']('placeholder', value);

});

Textarea.prototype.disabled = new Gaffa.Property(function(view, value){
    view.renderedElement[value ? 'setAttribute' : 'removeAttribute']('disabled', value);
});

module.exports = Textarea;