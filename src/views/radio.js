(function (undefined) {
    var viewType = "radio";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = document.createElement('div');

        renderedElement.className = classes;

        $(renderedElement).bind(viewModel.updateEventName || "change", function () {
            window.gaffa.model.set(viewModel.properties.value.binding, $(this).find(':checked').val(), viewModel);
        });

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                options: function (viewModel, firstRun) {
                    var property = viewModel.properties.options,
                        value = property.value,                        
                        element = $(viewModel.renderedElement),
                        groupName = viewModel.properties.groupName.value;

                    if (!Array.isArray(value)) {
                        value = [];
                    }

                    if (element) {
                        element.empty();
                        for (var i = 0; i < value.length; i++) {
                            var optionData = value[i];
                            if (optionData !== undefined) {
                                var option = document.createElement('input'),
                                    label = document.createElement('label'),
                                    container = document.createElement('div'),
                                    currentValue = gaffa.utils.getProp(value, i + gaffa.pathSeparator + property.valuePath);

                                option.setAttribute('type', 'radio');
                                option.setAttribute('name', groupName);

                                option.setAttribute('value', currentValue);
                                option.setAttribute('id', groupName + currentValue);
                                label.innerHTML = gaffa.utils.getProp(value, i + gaffa.pathSeparator + property.textPath);
                                label.setAttribute('for', groupName + currentValue);

                                element.append($(container).append(option, label));
                            }
                        }
                    }
                },
                value: function (viewModel, firstRun) {
                    var value = viewModel.properties.value.value,
                        options = $(viewModel.renderedElement).find('input');
                        
                    options.each(function(){
                        var option = $(this);
                        if(value === option.attr('value')){
                            option.attr("checked", "checked");
                        }
                    });
                }
            },
            defaults: {
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