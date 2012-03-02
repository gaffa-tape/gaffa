(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if (value && value.isArray && (viewModel.properties.list.value.length !== value.length || firstRun)) {
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
                            var listViews = viewModel.viewContainers.list;
                            while(value.length < listViews.length){
								var viewToDelete = viewModel.viewContainers.list.pop();
                                $(viewToDelete.renderedElement).remove();
								delete viewToDelete;
                            }
                            while(value.length > listViews.length){
                                window.gaffa.views.add($.extend(true, {}, viewModel.properties.list.template), viewModel, listViews, listViews.length);
                            }
                            window.gaffa.views.render(viewModel.viewContainers.list, viewModel.viewContainers.list.element);
                        }
                    }else if(value && value.length === 0){
                        while(viewModel.viewContainers.list.length){
								var viewToDelete = viewModel.viewContainers.list.pop();
                                $(viewToDelete.renderedElement).remove();
								delete viewToDelete;
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