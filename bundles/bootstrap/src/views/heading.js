//	Properties: 
//		size: h1 | h2 | h3 | h4 | h5 | h6
(function(undefined)) {
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.heading = window.gaffa.views.heading || newView();

	function createElement(viewModel) {
		var headingSize = "h1";
		if (viewModel.properties && viewModel.properties.size) {
			if (viewModel.properties.size.value) {
				style = viewModel.properties.size.value;
			}
		}
		return $(document.createElement(headingSize));
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