//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {

    var viewType = "datepicker",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes);

        renderedElement.bind(viewModel.updateEventName || "change", function () {
            window.gaffa.model.set(viewModel.properties.value.binding, new Date($(this).val()));
        });

        return renderedElement[0];
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                value: function (viewModel, value, firstRun) {
                    if (viewModel.properties.value.value !== value || firstRun) {
                        viewModel.properties.value.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            if (value !== undefined) {
                                $(element).val(value.toString());
                            } else {
                                $(element).val("");
                            }
                        }
                    }
                }
            },
            defaults: {
                properties: {
                    value: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();