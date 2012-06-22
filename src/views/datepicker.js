
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

        renderedElement.attr('type', 'datetime-local');

        renderedElement.bind(viewModel.updateEventName || "change", function () {
            window.gaffa.model.set(viewModel.properties.value.binding, Date.parse($(this).val()));
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
                                if (/iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent)) {
                                    // Have to use magical iOS format bullshit...
                                    if (value === null) {
                                        // More iPad awesome. If the default of today is used sets value to null
                                        value = new Date();
                                    }
                                    element.value = value.toString('yyyy-MM-ddThh:mm:ssZ').substring(0, 19);
                                } else {
                                    if (typeof window.gaffa.dateFormatter === 'function') {
                                        $(element).val(window.gaffa.dateFormatter(value));
                                    } else {
                                        $(element).val(value.toString());
                                    }
                                }
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