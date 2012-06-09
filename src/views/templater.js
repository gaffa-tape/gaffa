(function(undefined) {
    var viewType = "templater";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.children.element = renderedElement;
        
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
                        var children = viewModel.viewContainers.children;
                        window.gaffa.views.add($.extend(true, newView, viewModel.properties.children.template), viewModel, children, "~" + newView.key);
                        window.gaffa.views.render(viewModel.viewContainers.children, viewModel.viewContainers.children.element);
                    },
                    //remove
                    function(viewModel, children, orphanedView){
                        $(orphanedView.renderedElement).remove();
                    }
                )
            },
            defaults: {
                viewContainers:{
                    children: []
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();