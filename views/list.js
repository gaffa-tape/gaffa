(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        crel = require('crel'),
        viewType = "list",
		cachedElement;
        
    function List(){
        this.views.list = new Gaffa.ViewContainer(this.views.list);
        this.views.empty = new Gaffa.ViewContainer(this.views.empty);
    }
    List = Gaffa.createSpec(List, Gaffa.ContainerView);
    List.prototype.type = viewType;
    
    List.prototype.render = function(){
        
        var renderedElement = crel(this.tagName || 'div');
        
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
    
    List.prototype.list = new Gaffa.Property({
        update: Gaffa.propertyUpdaters.collection(
            "list",                     
            //increment
            function(viewModel, list, addedItem, insertIndex){
                var listViews = viewModel.views.list,
                    property = viewModel.list,
                    newView = createNewView(property, 'template');

                for(var key in addedItem){
                    newView[key] = addedItem[key];
                }

                listViews.add(newView, insertIndex);
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

    return List;
    
}));