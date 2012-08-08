//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {

    var viewType = "textbox",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function setValue(event){    
        var input = this;
        var matchFail = function(){
            $(input).addClass('error');
        };
        
        $(input).removeClass('error');
                
        if ($(input).attr("type") === "number") {
            window.gaffa.propertyUpdaters.string(input.viewModel, input.viewModel.properties.value, parseFloat($(input).val()), matchFail);
        } else {
            window.gaffa.propertyUpdaters.string(input.viewModel, input.viewModel.properties.value, $(input).val(), matchFail);
        } 
    }  
    
    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
                
        $(renderedElement).bind(viewModel.updateEventName || "change", setValue);

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                value: window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
                    $(viewModel.renderedElement).val(value);
                }),
                subType: window.gaffa.propertyUpdaters.string("subType", function(viewModel, value){
                    $(viewModel.renderedElement).attr('type', value);
                }),
                placeholder: window.gaffa.propertyUpdaters.string("placeholder", function(viewModel, value){
                    $(viewModel.renderedElement).attr('placeholder', value);
                }),
                disabled: window.gaffa.propertyUpdaters.bool("disabled", function(viewModel, value){
                    if (value)
                    {
                        viewModel.renderedElement.setAttribute('disabled', 'disabled');
                    }else{
                        viewModel.renderedElement.removeAttribute('disabled');
                    }
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