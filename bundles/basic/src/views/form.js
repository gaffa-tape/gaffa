//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();