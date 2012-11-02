(function (undefined) {
    var viewType = "autocomplete",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode()).addClass(classes);

        $(renderedElement).bind("change", function () {
            window.gaffa.model.set(viewModel.properties.value.binding, $(this).val());
        });

        return renderedElement[0];
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                list: function (viewModel, value, firstRun) {
                    if (Array.isArray(value)) {
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            //THIS IS FUCKING SHIT
                            setTimeout(function () {
                                element.kendoAutoComplete({
                                    dataSource: value,
                                    dataTextField: viewModel.properties.dataTextField.value
                                });
                            }, 0);
                        }
                    }
                },
                value: function (viewModel, value, firstRun) {
                    if (viewModel.properties.value.value !== value || firstRun) {
                        viewModel.properties.value.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            element.val(value);
                        }
                    }
                }
            },
            defaults: {
                properties: {
                    value: {},
                    list: {},
                    dataTextField: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }

})();