(function (undefined) {

    var viewType = "fileInput",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function setValue(event){    
        var input = this;
        
            window.gaffa.propertyUpdaters.string(input.viewModel, input.viewModel.properties.value, input.files);
    }  
    
    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode(true))
            .attr('type', 'file')
            .attr('accept', 'image/*')
            .addClass(classes)[0];
                
        $(renderedElement).bind(viewModel.updateEventName || "change", setValue);

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                value: window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
                    viewModel.renderedElement.files = value;
                })
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