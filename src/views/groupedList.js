(function(undefined) {
    var viewType = "groupedList",
    gaffa = window.gaffa;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0];
        
        viewModel.viewContainers.list.element = renderedElement;
        
        return renderedElement;
    }
    
    function getDistinctGroups(collection, property){
        var distinctValues = [];
        
        if(collection && typeof collection === "object"){
            if(collection.isArray){
                collection.fastEach(function(value){
                    var candidate = gaffa.utils.getProp(value, property);
                    if(distinctValues.indexOf(candidate)<0){
                        distinctValues.push(candidate);
                    }
                }); 
            }else{
                for(var key in collection){
                    var candidate = gaffa.utils.getProp(collection[key], property);
                    if(distinctValues.indexOf(candidate)<0){
                        distinctValues.push(candidate);
                    }
                }   
            }
        }
        
        return distinctValues;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {             
                list: function (viewModel, value, firstRun) {
                    var listViews = viewModel.viewContainers.list,
                        property = viewModel.properties.list;
                        
                    property.value = value;
                        
                    viewModel.distinctGroups = getDistinctGroups(property.value, property.group);
                    
                    //ToDo: finish...
                    
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