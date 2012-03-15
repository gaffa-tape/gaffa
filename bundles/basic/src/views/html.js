//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "html";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = document.createElement('span');
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                html: function(viewModel, value, firstRun) {
                    if (viewModel.properties.html.value !== value || firstRun) {
                        viewModel.properties.html.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.innerHTML = value;
                        }
                    }                    
                }
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