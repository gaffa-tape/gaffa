(function(undefined) {
    var viewType = "group",
    gaffa = window.gaffa;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.groups.element = renderedElement;
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {             
                groups: window.gaffa.propertyUpdaters.group(
                    "groups",                     
                    //increment
                    function(viewModel, groups, addedItem){
                        var listViews = viewModel.viewContainers.groups,
                            property = viewModel.properties.groups;
                            
                        $.extend(true, addedItem, property.template);
                            
                        addedItem.properties.list.filter = gaffa.relativePath + property.group + "===$" + addedItem.key;
                            
                        window.gaffa.views.add(addedItem, viewModel, listViews, property.binding);
                        window.gaffa.views.render(viewModel.viewContainers.groups, viewModel.viewContainers.groups.element);
                    },
                    //decrement
                    function(viewModel, groups, removedItem){
                        $(removedItem.renderedElement).remove();
                    }
                )
            },
            defaults: {
                viewContainers:{
                    groups: []
                },
                properties: {
                    groups: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();