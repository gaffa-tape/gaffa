(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        crel = require('crel'),
        viewType = "select",
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
    Select = Gaffa.createSpec(Select, Gaffa.ContainerView);
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
			
            viewModel.value.set(viewModel.value.binding, data, viewModel);
        });
        
        this.views.list.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Select.prototype.options = new Gaffa.Property(function(viewModel, value) {
        var property = this,
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
    
    Select.prototype.value = new Gaffa.Property(function(viewModel, value) {
        viewModel.renderedElement.value = value;
    });
    
    Select.prototype.optionText = new Gaffa.Property();
    Select.prototype.optionValue = new Gaffa.Property();
    Select.prototype.showBlank = new Gaffa.Property();
    Select.prototype.defaultIndex = new Gaffa.Property();

    return Select;
    
}));