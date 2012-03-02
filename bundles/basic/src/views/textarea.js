//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
	
	function setValue(event){
		window.gaffa.model.set(this.viewModel.properties.value.binding, $(this).val());    
	}

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = document.createElement('textarea');
		renderedElement.className = classes;		
		
        $(renderedElement).bind("change", setValue);
                
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
                            $(element).val(value);
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