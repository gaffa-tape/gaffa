//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined)) {
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views.container = window.gaffa.views.container || newView();
    
    var defaults = {};

	function createElement(viewModel) {
		var classes = "container";
		if (
            //ToDo: make a function that does this automaticaly
            viewModel.properties
            && viewModel.properties.classes
            && viewModel.properties.classes.value
        ) {
		    classes = viewModel.properties.classes.value;
		}
		return $(document.createElement('div')).addClass(classes);
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			render: function(viewModel) {
				if (viewModel.renderedElement) {
					return viewModel.renderedElement;
				}

				viewModel = $.extend(true, {}, defaults, viewModel);

				return viewModel.renderedElement = createElement(viewModel);
			},
			update: function(viewModel) {
				var element = viewModel.renderedElement;
			}
		};
		return new newView();
	}
}