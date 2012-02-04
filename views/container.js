//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
		if (gaffa.utils.propExists(viewModel, "properties.classes.value")) {
		    classes += " " + viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
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