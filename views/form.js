(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-form = factory();
    }
}(this, function(){
    var viewType = "form",
		cachedElement;
    
    function Form(){}
    Form = gaffa.createSpec(Form, gaffa.ContainerView);
    Form.prototype.type = viewType;
    
    Form.prototype.render = function(){        
        var form,
            viewModel = this,
            renderedElement = crel('div', 
                form = crel('form')
            );
        
        if (this.action) {
            form.setAttribute("action", this.action);
        } else {
            form.addEventListener('submit', function (event) {
                if(viewModel.actions.submit){
                    event.preventDefault();
                }
            });
        }

        if (this.method) {
            form.setAttribute("method", this.method);
        }
        
        this.views.content.element = form;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Form;

    return Form;
    
}));