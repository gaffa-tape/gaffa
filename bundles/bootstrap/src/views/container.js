//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined)) {
	window.gaffa = window.gaffa || newGaffa();
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
				var element = viewModel.renderedElement = createElement(viewModel);
				return element;
			},
			update: function(viewModel) {
				var element = viewModel.renderedElement;
			}
		};
		return new newView();
	}
}