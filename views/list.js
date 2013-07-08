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
	this.views.empty.element = renderedElement;        
    this.renderedElement = renderedElement;
    
    this.__super__.render.apply(this, arguments);
};

function createNewView(property, templateKey, addedItem){
    if(!property.templateCache){
        property.templateCache= {};
    }
    var view = JSON.parse(
        property.templateCache[templateKey] || 
        (property.templateCache[templateKey] = JSON.stringify(property[templateKey]))
    );

    for(var key in addedItem){
        view[key] = addedItem[key];
    }

    return property.gaffa.initialiseViewItem(view, property.gaffa, property.gaffa.views.constructors);
}

List.prototype.list = new Gaffa.Property({
    update: Gaffa.propertyUpdaters.collection(
        "list",                     
        //increment
        function(viewModel, list, addedItem, insertIndex){
            var listViews = viewModel.views.list,
                property = viewModel.list;


            listViews.add(createNewView(property, 'template', addedItem), insertIndex);
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
                    emptyViews.add(createNewView(property, 'emptyTemplate'));
                }
            }else{
                while(emptyViews.length){
                    emptyViews[0].remove();
                }
            }
        }
    ),
    trackKeys: true,
    sameAsPrevious:function () {
        var oldKeys = this.getPreviousHash(),
            value = this.value,
            newKeys = value && (value.__gaffaKeys__ || Object.keys(value));

        this.setPreviousHash(newKeys || value);

        if(newKeys && oldKeys && oldKeys.length){
            if(oldKeys.length !== newKeys.length){
                return;
            }
            for (var i = 0; i < newKeys.length; i++) {
                if(newKeys[i] !== oldKeys[i]){
                    return;
                }
            };
            return true;
        }

        return value === oldKeys;
    }
});

module.exports = List;