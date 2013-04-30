var Gaffa = require('./gaffa'),
	crel = require('crel');


var gaffa = new Gaffa();


var viewType = "container",
	cachedElement;

function Container(){
    this.views.content = new Gaffa.ViewContainer(this.views.content);
}
Container = Gaffa.createSpec(Container, Gaffa.ContainerView);
Container.prototype.type = viewType;

Container.prototype.render = function(){
    
    var renderedElement = crel(this.tagName || 'div');
    
    this.views.content.element = renderedElement;
    
    this.renderedElement = renderedElement;
    
    this.__super__.render.apply(this, arguments);
};

var container = new Container();

window.onload = function(){

	gaffa.views.add(container);

};

window.gaffa = gaffa;