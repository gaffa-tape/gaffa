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
			
            window.gaffa.model.set(viewModel.value.binding, data, viewModel);
        });
        
        viewModel.views.list.element = renderedElement;
        
        return renderedElement;
    }

    function addCurrentValue(renderedElement, value) {
        if (value && !$(renderedElement).children('[value='+ value + ']').length) {
            var fakeOption = document.createElement('option');
            fakeOption.innerText = value;
            fakeOption.value = value;
            fakeOption.setAttribute("disabled", "disabled");
            fakeOption.setAttribute("selected", "selected");
            renderedElement.selectedIndex = 0;
            $(renderedElement).prepend(fakeOption);

        }
    }

    function newView() {
        
        function view() {
        }
        
        view.prototype = {
            update: {
                options: function(viewModel, firstRun) {
                    var property = viewModel.options,
						value = property.value,
                        element = $(viewModel.renderedElement);
                        
                    if(!Array.isArray(value)){
                        value = [];
                    }
                    
                    if(element){
                        element.empty();
                        
                        if(viewModel.showBlank.value)
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

                        if (viewModel.value.value == null) {

                            if (viewModel.defaultIndex.value >= 0) {
							    element.prop('selectedIndex', viewModel.defaultIndex.value).change();
						    } else {
							    element.prop('selectedIndex', -1);
                            }

                        }


                    }
                },
                value: function(viewModel, firstRun) {
                    var value = viewModel.value.value;

                    viewModel.renderedElement.value = value;
                }
            },
            defaults: {
                views:{
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
                if(viewModel.defaultIndex.value >= 0){
                    viewModel.renderedElement.selectedIndex = viewModel.defaultIndex.value;
                    $(viewModel.renderedElement).change();
                } else {
                    viewModel.renderedElement.selectedIndex = -1;
                }

                addCurrentValue(viewModel.renderedElement, viewModel.value.value);

                if (viewModel.value.value) {
                    viewModel.renderedElement.value = viewModel.value.value;
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
    
})();
