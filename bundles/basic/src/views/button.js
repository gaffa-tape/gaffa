//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
        viewModel.viewContainers.content.element = renderedElement;
        
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
				viewContainers:{
					content:[]
				},
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();