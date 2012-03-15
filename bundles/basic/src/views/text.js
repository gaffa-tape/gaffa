//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "text";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = document.createTextNode('');

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                text: function (viewModel, value, firstRun) {
                    if (viewModel.properties.text.value !== value || firstRun) {
                        viewModel.properties.text.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            if (value !== undefined) {
                                element.data = value.toString();
                            } else {
                                element.data = "";
                            }
                        }
                    }
                }
            },
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();