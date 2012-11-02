//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "exercisePicker";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = document.createElement('div')
        renderedElement.className = classes;

        viewModel.viewContainers.content.element = renderedElement;

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                show: window.gaffa.propertyUpdaters.bool(
                    "show",
                    function (viewModel, value) {
                        var element = viewModel.renderedElement;
                        if (value) {
                            $(element).slideDown(200);
                        }else{
                            $(element).slideUp(200);
                        }
                    }
                )
            },
            defaults: {
                viewContainers: {
                    content: []
                },
                properties: {
                    visible: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();