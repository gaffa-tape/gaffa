//  Properties:
//      subType: vertical (default) | inline | search | horizontal
(function(undefined) {
    var viewType = "form";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType + "-vertical";
        
        if (gaffa.utils.propExists(viewModel, "properties.subType.value")) {
            classes = [viewType, "-", viewModel.properties.subType.value].join('');
        }

        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }   
        
        view.prototype = {
            update: {                
            },
            defaults: {
                viewContainers:{
                    content:[]
                },
                properties: {
                    visible: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();