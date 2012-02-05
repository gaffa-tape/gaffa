//  Properties:
(function(undefined) {
    var viewType = "controls";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {

        var renderedElement = $(document.createElement('div')).addClass('controls');
        
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