(function(undefined) {
    var viewType = "select",
		cachedElement;
    
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
        
    function Select(){
        this.views.list = new gaffa.ViewContainer(this.views.list);
    }
    Select = gaffa.createSpec(Select, gaffa.ContainerView);
    Select.prototype.type = viewType;
    
    Select.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('select'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        var viewModel = this;
        
        $(renderedElement).on(this.updateEventName || "change", function(event){
			var element = $(this),
				option = element.find('option').filter(function(){
					return this.value === element[0].value;
				})[0],
				data = option && option.data || undefined;
			
            window.gaffa.model.set(viewModel.value.binding, data, viewModel);
        });
        
        this.views.list.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Select.prototype.options = new gaffa.Property(function() {
        var viewModel = this,
            property = this.options,
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
    });
    
    Select.prototype.value = new gaffa.Property(function() {
        var value = this.value.value;

        this.renderedElement.value = value;
    });
    
    Select.prototype.optionText = new gaffa.Property();
    Select.prototype.optionValue = new gaffa.Property();
    Select.prototype.showBlank = new gaffa.Property();
    Select.prototype.defaultIndex = new gaffa.Property();
    
    gaffa.views[viewType] = Select;
    
})();