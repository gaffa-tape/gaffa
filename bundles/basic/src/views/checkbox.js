//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes)[0];
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = $(viewModel.renderedElement);
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();