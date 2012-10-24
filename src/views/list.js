(function(undefined) {
    var viewType = "list";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.list.element = renderedElement;
		viewModel.viewContainers.empty.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {             
                list: window.gaffa.propertyUpdaters.collection(
                    "list",                     
                    //increment
                    function(viewModel, list, addedItem){
                        var listViews = viewModel.viewContainers.list,
                            property = viewModel.properties.list;
                        window.gaffa.views.add($.extend(true, addedItem, property.template), viewModel, listViews);
                        window.gaffa.views.render(listViews, listViews.element);
                    },
                    //decrement
                    function(viewModel, list, removedItem){
                        viewModel.renderedElement.removeChild(removedItem.renderedElement);
                    },
                    //empty
                    function(viewModel, insert){
                        var emptyViews = viewModel.viewContainers.empty,
                            property = viewModel.properties.list;
							
						if(!property.emptyTemplate){
							return;
						}
						
						if(insert){
							if(!emptyViews.length){
								window.gaffa.views.add($.extend(true, {}, property.emptyTemplate), viewModel, emptyViews);
								window.gaffa.views.render(emptyViews, emptyViews.element);
							}
						}else{
							while(emptyViews.length){
								viewModel.renderedElement.removeChild(emptyViews.pop().renderedElement);
							}
						}
                    }
                )
            },
            defaults: {
                viewContainers:{
                    list: [],
                    empty: []
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