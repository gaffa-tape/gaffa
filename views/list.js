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

    function createNewView(property, templateKey){
        if(!property.templateCache){
            property.templateCache= {};
        }
        return JSON.parse(
            property.templateCache[templateKey] || 
            (property.templateCache[templateKey] = JSON.stringify(property[templateKey]))
        );
    }
    
    List.prototype.list = new gaffa.Property({
        update: window.gaffa.propertyUpdaters.collection(
            "list",                     
            //increment
            function(viewModel, list, addedItem){
                var listViews = viewModel.views.list,
                    property = viewModel.list,
                    newView = createNewView(property, 'template');

                for(var key in addedItem){
                    newView[key] = addedItem[key];
                }

                listViews.add(newView);
            },
            //decrement
            function(viewModel, list, removedItem){
                removedItem.remove();
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
                        window.gaffa.views.add(createNewView(property, 'emptyTemplate'), viewModel, emptyViews);
                    }
                }else{
                    while(emptyViews.length){
                        viewModel.renderedElement.removeChild(emptyViews.pop().renderedElement);
                    }
                }
            }
        ),
        trackKeys: true
    });
    
    gaffa.views[viewType] = List;
    
})();