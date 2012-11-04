(function(undefined) {
    var viewType = "form";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var form = document.createElement('form'),
            renderedElement;
        
        if (viewModel.action) {
            form.setAttribute("action", viewModel.action);
        } else {
            $(form).on('submit', function (event) {
                event.preventDefault();
            });
        }

        if (viewModel.method) {
            form.setAttribute("method", viewModel.method);
        }

        renderedElement = $(document.createElement('div')).append(form).addClass(classes)[0];
        
        viewModel.viewContainers.content.element = form;
                
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
        };
        
        gaffa.extend(view.prototype, window.gaffa.views.base(viewType, createElement));
                
        return new view();
    }
})();
