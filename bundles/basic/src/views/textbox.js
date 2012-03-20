//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {

    var viewType = "textbox",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function setValue(event){          
		if ($(this).attr("type") === "numeric") {
                window.gaffa.model.set(this.viewModel.properties.value.binding, parseFloat($(this).val()));
            } else {
                window.gaffa.model.set(this.viewModel.properties.value.binding, $(this).val());
		} 
	}  
	
    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode()).addClass(classes)[0];
		
        $(renderedElement).bind("change", setValue);

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