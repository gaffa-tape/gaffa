(function(undefined) {
    var viewType = "form";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var form = document.createElement('form'),
            renderedElement = $(document.createElement('div')).append(form).addClass(classes)[0];
        
        viewModel.viewContainers.content.element = form;
                
        $(form).on('submit', function(event){
            event.preventDefault();
        });
                
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
