(function (undefined) {
    var viewType = "image";

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
	
	function imageToURI(image, callback) {
        var reader = new window.FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(image);
	}

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
                }),
				image: window.gaffa.propertyUpdaters.object("image", function (viewModel, value) {
					if(!value){
						return;
					}
					if(typeof value === 'string'){
						viewModel.renderedElement.setAttribute("src", value);
					}else{
						imageToURI(value, function(dataURI){
							viewModel.renderedElement.setAttribute("src", dataURI);
						});
					}
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