(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        viewModel.properties.list.value = value;
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
                            var listViews = viewModel.viewContainers.list;
                            while(value.length < listViews.length){
                                viewModel.viewContainers.list.pop().renderedElement.remove();
                            }
                            while(value.length > listViews.length){
                                window.gaffa.views.add($.extend(true, {}, viewModel.properties.list.template), viewModel, listViews, listViews.length);
                            }
                            window.gaffa.views.render(viewModel.viewContainers.list, viewModel.viewContainers.list.element);
                        }
                    }else if(value && value.length === 0){
                        while(viewModel.viewContainers.list.length){
                            viewModel.viewContainers.list.pop().renderedElement.remove();
                        }
                    }
                }
			},
            defaults: {
                viewContainers:{
                    list: []
                },
                properties: {             
                    list: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();