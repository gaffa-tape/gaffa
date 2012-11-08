(function(undefined) {
    var viewType = "select",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('select'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        $(renderedElement).bind(viewModel.updateEventName || "change", function(event){
			var element = $(this),
				option = element.find('option').filter(function(){
					return this.value === element[0].value;
				})[0],
				data = option && option.data || undefined;
			
            window.gaffa.model.set(viewModel.properties.value.binding, data, viewModel);
        });
        
        viewModel.viewContainers.list.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }
        
        view.prototype = {
            update: {
                options: function(viewModel, firstRun) {
                    var property = viewModel.properties.options,
						value = property.value,
                        element = $(viewModel.renderedElement);
                        
                    if(!Array.isArray(value)){
                        value = [];
                    }
                    
                    if(element){
                        element.empty();
                        
                        if(viewModel.properties.showBlank.value)
                        {
                            element.append(document.createElement("option"));
                        }

                        for(var i = 0; i < value.length; i ++){
                            var optionData = value[i];
                            if(optionData !== undefined){
                                var option = document.createElement('option');
                                
                                option.value = option.data = gaffa.utils.getProp(value, i + gaffa.pathSeparator +  property.valuePath);
                                option.innerHTML = gaffa.utils.getProp(value, i + gaffa.pathSeparator +  property.textPath);

                                element.append(option);
                            }
                        }

                        if(viewModel.properties.defaultIndex.value >= 0){
							element.prop('selectedIndex', viewModel.properties.defaultIndex.value).change();
						} else {
							element.prop('selectedIndex', -1);
						}
                    }
                },
                value: function(viewModel, firstRun) {
                    var value = viewModel.properties.value.value;
					
                    viewModel.renderedElement.value = value;
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
                    optionValue: {},
                    showBlank: {},
                    defaultIndex: {}
                }
            },
            afterInsert:function(viewModel){
                if(viewModel.properties.defaultIndex.value >= 0){
                    viewModel.renderedElement.selectedIndex = viewModel.properties.defaultIndex.value;
                    $(viewModel.renderedElement).change();
                } else {
                    viewModel.renderedElement.selectedIndex = -1;
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
    
})();
