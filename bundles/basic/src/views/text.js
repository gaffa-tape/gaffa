//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function (undefined) {
    var viewType = "text",
		shit,
		findShitBrowsersRegex = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	
	if (navigator.appName == 'Microsoft Internet Explorer'&&
		parseFloat(findShitBrowsersRegex.exec(navigator.userAgent)[1])<9
	) {
		shit = true;
    }

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView()

    function createElement(viewModel) {
        var classes = viewType,
			renderedElement;
		
		//Internet expoder, as usual, is FUCKING SHIT.
		//and won't let you add values to textNode elements.
		if(!shit){
			renderedElement = document.createTextNode('');
		}else{
			renderedElement = document.createElement('span');
		}

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
				text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
					if(!shit){
						viewModel.renderedElement.data = value;
					}else{
						viewModel.renderedElement.innerText = value;
					}
				})
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