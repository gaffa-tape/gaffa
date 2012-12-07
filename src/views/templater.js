(function(undefined) {
    var viewType = "templater";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.views.children.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {             
                children: window.gaffa.propertyUpdaters.collection(
                    "children",
                    //insert
                    function(viewModel, value, newView){
                        var children = viewModel.views.children;
                        window.gaffa.views.add($.extend(true, newView, viewModel.children.template), viewModel, children, "~" + newView.key);
                        window.gaffa.views.render(viewModel.views.children, viewModel.views.children.element);
                    },
                    //remove
                    function(viewModel, children, orphanedView){
                        $(orphanedView.renderedElement).remove();
                    }
                )
            },
            defaults: {
                views:{
                    children: []
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();