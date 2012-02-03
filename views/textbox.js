//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
	window.gaffa.views = window.gaffa.views || {};
	var thisView = window.gaffa.views.textbox = window.gaffa.views.textbox || newView();
    
    var defaults = {
            viewContainers:{},
            properties: {
                text: {}   
            }
        };

	function createElement(viewModel) {
		var classes = "textbox";
		if (
            //ToDo: make a function that does this automaticaly
            viewModel.properties
            && viewModel.properties.classes
            && viewModel.properties.classes.value
        ) {
		    classes = viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('input')).attr('type', 'text').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            gaffa.model.set(viewModel.properties.text.binding, $(this).val());    
        });
        
        viewModel.viewContainers.content = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			render: function(viewModel) {
        		if (viewModel.renderedElement) {
					return viewModel.renderedElement;
				}

				$.extend(true, viewModel, defaults, viewModel);
                
                viewModel.renderedElement = createElement(viewModel);
                
                for(var key in viewModel.properties){
                    thisView.update[key](viewModel, viewModel.properties[key].value, true);
                }

				return viewModel.renderedElement;
            },
			update: {
                text: function(viewModel, value, firstRun) {
                    if(viewModel.properties.text.value !== value || firstRun){
                        viewModel.properties.text.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			}
		};
		return new view();
	}
})();