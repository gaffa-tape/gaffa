var Gaffa = require('gaffa'),
    crel = require('crel'),
    doc = require('doc-js'),
    viewType = "select",
    cachedElement;

function Select(){}
Select = Gaffa.createSpec(Select, Gaffa.View);
Select.prototype.type = viewType;

Select.prototype.render = function(){
    var viewModel = this,
        select,
        renderedElement = crel('span',
            select = crel('select')
        );

    renderedElement.className = 'select';

    doc.on(this.updateEventName || "change", select, function(event){
        var option,
            data;

        for(var i = 0; i < select.childNodes.length; i++){
            if(select.childNodes[i].value === select.value){
                option = select.childNodes[i];
            }
        }

        data = option && option.data || undefined;

        viewModel.value.set(data);
    });

    this.renderedElement = renderedElement;

};

Select.prototype.options = new Gaffa.Property(function(viewModel, value) {
    var property = this,
        element = viewModel.renderedElement.childNodes[0];

    if(!Array.isArray(value)){
        value = [];
    }

    if(element){
        element.innerHTML = '';

        if(viewModel.showBlank.value)
        {
            element.appendChild(document.createElement("option"));
        }

        for(var i = 0; i < value.length; i ++){
            var optionData = value[i];
            if(optionData !== undefined){
                var option = document.createElement('option');

                option.value = option.data = gaffa.gedi.utils.get(property.valuePath, optionData);
                option.textContent = gaffa.gedi.utils.get(property.textPath, optionData);

                element.appendChild(option);
            }
        }

        if (viewModel.value.value == null) {

            if (viewModel.defaultIndex.value >= 0) {
                element.selectedIndex = viewModel.defaultIndex.value
                element.change();
            } else {
                element.selectedIndex = -1;
            }

        }
    }
});

Select.prototype.value = new Gaffa.Property(function(viewModel, value) {
    viewModel.renderedElement.childNodes[0].value = value;
});

Select.prototype.showBlank = new Gaffa.Property();
Select.prototype.defaultIndex = new Gaffa.Property();

module.exports = Select;