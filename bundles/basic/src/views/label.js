//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes)[0];
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
					viewModel.renderedElement.innerHTML = value;
				})
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();