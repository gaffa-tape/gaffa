//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "radioOption",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = (function(){
            var input = $(document.createElement('input')).attr('type','radio'),
				label = $(document.createElement('span')).addClass('radioLabel'),
				renderedElement = $(document.createElement('span')).addClass(viewType).append(input, label);
                return renderedElement[0];
        })());  
        
        renderedElement = $(renderedElement.cloneNode(true));      
        
        $(renderedElement).delegate("input", "change", function(){
			var target = $(event.target);
			if(target.attr("checked")){
				window.gaffa.model.set(viewModel.properties.checked.binding, viewModel.properties.value.value);
			}   
        });
        
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
                        var element = viewModel.renderedElement.children('.radioLabel');
                        if(element){
                            element.html(value);
                        }
                    }                    
                },
                value: function(viewModel, value, firstRun) {
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement.children('input');
                        if(element){
                             element.attr('value', value);
                        }
                    }                    
                },
				checked: function(viewModel, value, firstRun) {
					var element = viewModel.renderedElement.children('input');
					if(element){
						if(value === viewModel.properties.value.value){
							element.attr("checked", "checked");
						}else if(value === null || value === undefined || value === ""){
							element.removeAttr("checked");
						}
					}                                   
                },
				name: function(viewModel, value, firstRun) {
                    if(viewModel.properties.name.value !== value || firstRun){
                        viewModel.properties.name.value = value;
                        var element = viewModel.renderedElement.children('input');
                        if(element){
                            element.attr("name", value);
                        }
                    }                    
                }
            },
            defaults: {
                viewContainers:{
                    content:[],
                    header:[]
                },
                properties:{
                    value: {},
                    checked: {},
                    name: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
    
})();