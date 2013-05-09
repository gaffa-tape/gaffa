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
        viewType = "form",
        crel = require('crel'),
		cachedElement;
    
    function Form(){}
    Form = Gaffa.createSpec(Form, Gaffa.ContainerView);
    Form.prototype.type = viewType;
    
    Form.prototype.render = function(){        
        var viewModel = this,
            renderedElement = crel('form')
        
        if (this.action) {
            renderedElement.setAttribute("action", this.action);
        } else {
            renderedElement.addEventListener('submit', function (event) {
                if(viewModel.actions.submit){
                    event.preventDefault();
                }
            });
        }

        if (this.method) {
            renderedElement.setAttribute("method", this.method);
        }
        
        this.views.content.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };

    return Form;
    
}));