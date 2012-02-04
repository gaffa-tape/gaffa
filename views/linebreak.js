//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
		if (gaffa.utils.propExists(viewModel, "properties.classes.value")) {
    	    classes += " " + viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();