//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
	
	function setValue(event){
		var textArea = this;
		
		var matchFail = function(){
			$(textArea).addClass('error');
		}
		
		window.gaffa.propertyUpdaters.string(textArea.viewModel.properties.value, $(textArea).val(), matchFail); 
	}

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = document.createElement('textarea');
		renderedElement.className = classes;		
		
        $(renderedElement).bind(viewModel.updateEventName || "change", setValue);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
				value: window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
					$(viewModel.renderedElement).val(value);
				})
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