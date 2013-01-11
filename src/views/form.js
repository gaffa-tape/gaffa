(function(undefined) {
    var viewType = "form",
		cachedElement;
    
    function Form(){}
    Form = gaffa.createSpec(Form, gaffa.ContainerView);
    Form.prototype.type = viewType;
    
    Form.prototype.render = function(){
        var classes = viewType;
        
        var form = document.createElement('form'),
            renderedElement;
        
        if (this.action) {
            form.setAttribute("action", this.action);
        } else {
            $(form).on('submit', function (event) {
                event.preventDefault();
            });
        }

        if (this.method) {
            form.setAttribute("method", this.method);
        }

        renderedElement = $(document.createElement('div')).append(form).addClass(classes)[0];
        
        this.views.content.element = form;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Form;
    
})();