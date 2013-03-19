(function(undefined) {
    var gaffa = window.gaffa,
        viewType = "group";
    
    function Group(){
        this.views.groups = new gaffa.ViewContainer(this.views.groups);
        this.views.empty = new gaffa.ViewContainer(this.views.empty);
    }
    Group = gaffa.createSpec(Group, gaffa.ContainerView);
    Group.prototype.type = viewType;
    Group.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        this.views.groups.element = renderedElement;
        this.views.groups.property = this.groups;
        this.views.empty.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    }

           
    Group.prototype.groups = new gaffa.Property(window.gaffa.propertyUpdaters.group(
        "groups",                     
        //increment
        function(viewModel, groups, addedItem){
            var listViews = viewModel.views.groups,
                property = viewModel.groups,
                groupContainer = new gaffa.views.container(),
                expression,
                newHeader,
                newList;

            for(var key in addedItem){
                groupContainer[key] = addedItem[key];
            }

            if(property.headerTemplate){
                newHeader = JSON.parse(JSON.stringify(property.headerTemplate));

                groupContainer.views.content.push(newHeader);
            }

            if(property.listTemplate){
                newList = JSON.parse(JSON.stringify(property.listTemplate));

                expression = '(filter [] {item (= (' + property.expression + ' item) "' + addedItem.group + '")})';
                
                newList.list = newList.list || {};
                newList.list.binding = expression;

                groupContainer.views.content.add(newList);
            }

            listViews.add(groupContainer);
        },
        //decrement
        function(viewModel, groups, removedItem){
            removedItem.remove();
        },
        //empty
        function(viewModel, insert){
            var emptyViews = viewModel.views.empty,
                property = viewModel.groups;
                
            if(!property.emptyTemplate){
                return;
            }
            
            if(insert){
                if(!emptyViews.length){
                    window.gaffa.views.add($.extend(true, {}, property.emptyTemplate), viewModel, emptyViews);
                }
            }else{
                while(emptyViews.length){
                    viewModel.renderedElement.removeChild(emptyViews.pop().renderedElement);
                }
            }
        }
    ));
                
    gaffa.views[viewType] = Group;
    
})();