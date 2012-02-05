//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
		if (gaffa.utils.propExists(viewModel, "properties.classes.value")) {
    	    classes += " " + viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                text: function(viewModel, value, firstRun) {
                    if(viewModel.properties.text.value !== value || firstRun){
                        viewModel.properties.text.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
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