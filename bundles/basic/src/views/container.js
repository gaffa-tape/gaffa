//	Properties:
(function(undefined)) {
	window.gaffa = window.gaffa || newGaffa();
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.container = window.gaffa.views.container || newView();

	function createElement(viewModel) {
		return $(document.createElement('div')).addClass('container');
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