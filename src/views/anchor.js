//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "anchor";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = $(document.createElement('a')).addClass(classes)[0];

        viewModel.viewContainers.content.element = renderedElement;

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
                    if(value !== null && value !== undefined){
                        viewModel.renderedElement.innerHTML = value;
                    }else{
                        viewModel.renderedElement.innerHTML = "";
                    }
                }),
                href: window.gaffa.propertyUpdaters.string("href", function(viewModel, value){
                    if(value !== null && value !== undefined){
                        viewModel.renderedElement.setAttribute("href",value);
                    }else{
                        viewModel.renderedElement.removeAttribute("href");
                    }
                })
            },
            defaults: {
                viewContainers: {
                    content: []
                },
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();