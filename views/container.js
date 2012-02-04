//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    
    var defaults = {
        viewContainers:{},
        properties: {
            visible: {}   
        }
    };
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.container = window.gaffa.views.container || newView();
    
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
        
        $.extend(true, view.prototype, window.gaffa.views.base("container", createElement, defaults));
                
		return new view();
	}
})();