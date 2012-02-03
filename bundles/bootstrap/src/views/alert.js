//	Properties:
//		style: error | success | info
//		text: 
//		isCloseable: true | false
(function(undefined)) {
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.alert = window.gaffa.views.alert || newView();

	function createElement(viewModel) {
		var element = $(document.createElement('div')).addClass(style),
			style = "alert alert-info",
			properties = viewModel.properties;

		if (properties) {
			if (properties.style) {
				if (properties.style.value) {
					style = "alert alert-" + properties.style.value;
				}
			}
			if (properties.isCloseable) {
				if (properties.isCloseable.value) {
					element.append($(document.createElement('a')).addClass('close').text('x'));
				}
			}
			if (properties.text) {
				if (properties.text.value) {
					element.text(properties.text.value);
				}
			}
		}
		return element.addClass(style);
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			render: function(viewModel) {
				if (viewModel.renderedElement) {
					return viewModel.renderedElement;
				}

				viewModel = $.extend(true, defaults, viewModel);

				return viewModel.renderedElement = createElement(viewModel);
			},
			update: function(viewModel) {
				var element = viewModel.renderedElement;
			}
		};
		return new newView();
	}
}