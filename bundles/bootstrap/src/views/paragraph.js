//	Properties:
(function(undefined)) {
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.paragraph = window.gaffa.views.paragraph || newView();

	function createElement(viewModel) {
		return $(document.createElement('p'));
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