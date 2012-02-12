/******************************************select******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "select",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('select'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.value.binding, $(this).val());    
        });
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                options: function(viewModel, value, firstRun) {
                    if (value && value.isArray && (viewModel.properties.options.value.length !== value.length || firstRun)) {
                        viewModel.properties.options.value = value.slice();   
						var optionsObj = viewModel.properties.options;
                        var element = viewModel.renderedElement;
						
                        if(element){
							element.empty();							
							element.append($(document.createElement("option")).val(""));
                            for(var i = 0; i < value.length; i ++){
								var optionData = value[i];
                                if(optionData !== undefined){
									var option = document.createElement('option');
									
									option.value = window.gaffa.model.get(
										gaffa.paths.getAbsolutePath(
											viewModel.properties.options.binding + gaffa.pathSeparator() + i ,												
											optionsObj.valueBinding
										)
									);
								
									option.innerHTML = window.gaffa.model.get(
										gaffa.paths.getAbsolutePath(
											viewModel.properties.options.binding + gaffa.pathSeparator() + i ,												
											optionsObj.textBinding
										)
									);	

									element.append(option);
								}
                            }
                        }
                    }
                },
				value: function(viewModel, value, firstRun) {
                    viewModel.properties.value.value = value;
					var element = viewModel.renderedElement;
					if(element){
						if(value === null || value === undefined || value === ""){
							element.val("");
						}else{
							element.val(value);
						}
					}                                      
                }
			},
            defaults: {
                viewContainers:{
                    list: []
                },
                properties: {
					value: {},
					options: {},			
					optionText: {},
					optionValue: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
    
})();