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
                value: function (viewModel, value, firstRun) {
                    if (viewModel.properties.value.value !== value || firstRun) {
                        viewModel.properties.value.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            element.val(value);
                        }
                    }
                },
                subType: function (viewModel, value, firstRun) {
                    if (viewModel.properties.subType.value !== value || firstRun) {
                        viewModel.properties.subType.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            element.attr('type', value);
                        }
                    }
                },
                placeholder: function (viewModel, value, firstRun) {
                    if (viewModel.properties.placeholder.value !== value || firstRun) {
                        viewModel.properties.placeholder.value = value;
                        var element = $(viewModel.renderedElement);
                        if (element) {
                            element.attr('placeholder', value);
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