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
                    }
                )
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