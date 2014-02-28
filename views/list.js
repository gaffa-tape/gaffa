var Gaffa = require('gaffa'),
    crel = require('crel'),
    TemplaterProperty = require('gaffa/src/templaterProperty'),
    viewType = "list",
	cachedElement;

function List(){
    this.views.list = new Gaffa.ViewContainer(this.views.list);
    this.views.empty = new Gaffa.ViewContainer(this.views.empty);
}
List = Gaffa.createSpec(List, Gaffa.ContainerView);
List.prototype.type = viewType;

List.prototype.render = function(){

    var renderedElement = crel(this.tagName || 'div');

    this.views.list.element = renderedElement;
	this.views.empty.element = renderedElement;
    this.renderedElement = renderedElement;

};

List.prototype.list = new TemplaterProperty({
    viewsName: 'list'
});

module.exports = List;