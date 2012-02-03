//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined)) {
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.container = window.gaffa.views.container || newView();

	function createElement(viewModel) {
		var style = "container";
		if (viewModel.properties && viewModel.properties.style) {
			if (viewModel.properties.style.value) {
				style = viewModel.properties.style.value;
			}
		}
		return $(document.createElement('div')).addClass(style);
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