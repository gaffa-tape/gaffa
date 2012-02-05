//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.value.binding, $(this).val());    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                value: function(viewModel, value, firstRun) {
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();