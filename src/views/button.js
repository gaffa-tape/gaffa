//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes)[0];
                
        viewModel.viewContainers.content.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }	
        
        view.prototype = {
            update: {
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
					if(value !== null && value !== undefined){
						viewModel.renderedElement.innerHTML = value;
					}else{
						viewModel.renderedElement.innerHTML = "";
					}
				}),
				subType: window.gaffa.propertyUpdaters.string("subType", function(viewModel, value){
					if(value !== null && value !== undefined){
						viewModel.renderedElement.setAttribute("type",value);
					}else{
						viewModel.renderedElement.removeAttribute("type");
					}
				})
            },
            defaults: {
                viewContainers:{
                    content:[]
                },
                properties: {
                    text: {},
					subType:{}
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