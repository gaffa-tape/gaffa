//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
	window.gaffa.views = window.gaffa.views || {};
	var thisView = window.gaffa.views.container = window.gaffa.views.container || newView();
    
    var defaults = {
            viewContainers:{},
            properties: {
                visible: {}   
            }
        };

	function createElement(viewModel) {
		var classes = "container";
		if (
            //ToDo: make a function that does this automaticaly
            viewModel.properties
            && viewModel.properties.classes
            && viewModel.properties.classes.value
        ) {
		    classes = viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
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
                visible: function(viewModel, value, firstRun) {
                    if(viewModel.properties.visible.value !== value || firstRun){
                        viewModel.properties.visible.value = value;
    				    var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.show();
                            }else{
                                element.hide();
                            }
                        }
                    }                    
                }
			}
		};
		return new view();
	}
})();