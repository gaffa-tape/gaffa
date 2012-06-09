//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "image";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = $(document.createElement('img')).addClass(classes)[0];

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                source: window.gaffa.propertyUpdaters.string("source", function (viewModel, value) {
                    viewModel.renderedElement.setAttribute("src", value);
                })
            },
            defaults: {
                properties: {
                    visible: {},
                    source: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();