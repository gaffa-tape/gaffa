(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).addClass(classes)[0];
                
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
					viewModel.renderedElement.setAttribute("type", value || 'button');
                }),
                disabled: window.gaffa.propertyUpdaters.bool("disabled", function(viewModel, value){
					if(value){
						viewModel.renderedElement.setAttribute("disabled", "disabled");
					}else{
						viewModel.renderedElement.removeAttribute("disabled");					
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
    
    $(document).on('button', 'click', function(event){
        event.preventDefault();
    });
    
})();