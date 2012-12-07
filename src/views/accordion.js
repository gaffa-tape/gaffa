/******************************************accordion******************************************/

//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        viewModel.views.list.element = renderedElement;
        
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
                        var listViews = viewModel.views.list,
                            property = viewModel.list;
                        if(property.template.type === "accordionNode"){
                            window.gaffa.views.add($.extend(true, {}, property.template), viewModel, listViews, property.binding + gaffa.pathSeparator + addedItem.key);
                            window.gaffa.views.render(viewModel.views.list, viewModel.views.list.element);
                        }else{
                            throw "incorrect template type given, expected type of 'accordionNode'";
                        }
                    },
                    //decrement
                    function(viewModel, list, removedItem){
                        $(removedItem.renderedElement).remove();
                    }
                )
            },
            defaults: {
                views:{
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
    
/******************************************accordionNode******************************************/

//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordionNode",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        cachedElement = cachedElement || (cachedElement = (function(){
            var header = $(document.createElement('div')).addClass("header").attr('tabindex','0'),
                content = $(document.createElement('div')).addClass("content").hide(),
                renderedElement = $(document.createElement('li')).addClass(classes).append(header, content);                
                return renderedElement[0];
        })());
        
        
        var renderedElement = cachedElement.cloneNode(true);
        
        viewModel.views.content.element = $(renderedElement).find('.content')[0];
        viewModel.views.header.element = $(renderedElement).find('.header')[0];
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {                            
                expanded: function(viewModel, value, firstRun) {
                    if(viewModel.expanded.value !== value || firstRun){
                        viewModel.expanded.value = value;
                        var element = $(viewModel.renderedElement);
                        if(element){
                            if(value !== false){
                                element.children(".content").slideDown(200);
                            }else{
                                element.children(".content").slideUp(200);
                            }
                        }
                    }                    
                }
            },
            defaults: {
                views:{
                    content:[],
                    header:[]
                },
                properties:{
                    expanded: { value: false }
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
    
    /*Delegated Event Handlers*/


        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.expanded.binding, window.gaffa.model.get(viewModel.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();