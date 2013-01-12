(function(undefined) {
    var viewType = "list",
		cachedElement;
        
    function List(){
        this.views.list = new gaffa.ViewContainer(this.views.list);
        this.views.empty = new gaffa.ViewContainer(this.views.empty);
    }
    List = gaffa.createSpec(List, gaffa.ContainerView);
    List.prototype.type = viewType;
    
    List.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        this.views.list.element = renderedElement;
        this.views.list.property = this.list;
		this.views.empty.element = renderedElement;
        this.views.empty.property = this.list;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    List.prototype.list = new gaffa.Property(window.gaffa.propertyUpdaters.collection(
        "list",                     
        //increment
        function(viewModel, list, addedItem){
            var listViews = viewModel.views.list,
                property = viewModel.list;
                
            listViews.add(gaffa.extend({}, property.template, addedItem));
        },
        //decrement
        function(viewModel, list, removedItem){
            viewModel.renderedElement.removeChild(removedItem.renderedElement);
        },
        //empty
        function(viewModel, insert){
            var emptyViews = viewModel.views.empty,
                property = viewModel.list;
                
            if(!property.emptyTemplate){
                return;
            }
            
            if(insert){
                if(!emptyViews.length){
                    window.gaffa.views.add(gaffa.extend({}, property.emptyTemplate), viewModel, emptyViews);
                }
            }else{
                while(emptyViews.length){
                    viewModel.renderedElement.removeChild(emptyViews.pop().renderedElement);
                }
            }
        }
    ));
    
    gaffa.views[viewType] = List;
    
})();