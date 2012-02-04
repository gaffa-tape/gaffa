//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading",
        defaults = {
            properties: {
                visible: {},
                text: {}
            }
        };
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
		if (
            //ToDo: make a function that does this automaticaly
            viewModel.properties
            && viewModel.properties.classes
            && viewModel.properties.classes.value
        ) {
		    classes += " " + viewModel.properties.classes.value;
		}
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            if(value !== false){
                                element.show();
                            }else{
                                element.hide();
                            }
                        }
                    }                    
                },
                text: function(viewModel, value, firstRun) {
                    if(viewModel.properties.text.value !== value || firstRun){
                        viewModel.properties.text.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
			}
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement, defaults));
                
		return new view();
	}
})();