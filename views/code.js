//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();