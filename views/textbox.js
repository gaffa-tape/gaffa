//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var defaults = {
        viewContainers:{},
        properties: {
            text: {}   
        }
    };
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.textbox = window.gaffa.views.textbox || newView();

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
        
        $.extend(true, view.prototype, window.gaffa.views.base("textbox", createElement, defaults));
        
		return new view();
	}
})();