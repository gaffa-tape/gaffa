/******************************************accordion******************************************/
(function(undefined) {
    var viewType = "accordion",
		cachedElement;
        
    function Accordion(){
        this.views.list = new gaffa.ViewContainer(this.views.list);
        this.views.empty = new gaffa.ViewContainer(this.views.empty);
    }
    Accordion = gaffa.createSpec(Accordion, gaffa.ContainerView);
    Accordion.prototype.type = viewType;
    
    Accordion.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        this.views.list.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Accordion.prototype.list = new gaffa.Property(window.gaffa.propertyUpdaters.collection(
        "list",                     
        // increment
        function(viewModel, list, addedItem){
            var listViews = viewModel.views.list,
                property = viewModel.list;
                
            if(property.template.type === "accordionNode"){                
                listViews.add(gaffa.extend({}, property.template, addedItem));
            }else{
                throw "incorrect template type given, expected type of 'accordionNode'";
            }
        },
        // decrement
        function(viewModel, list, removedItem){
            $(removedItem.renderedElement).remove();
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
    
    gaffa.views[viewType] = Accordion;
    
})();
    
/******************************************accordionNode******************************************/
(function(undefined) {
    var viewType = "accordionNode",
		cachedElement;
    
    function AccordionNode(){
        this.views.header = new gaffa.ViewContainer(this.views.header);
    }
    AccordionNode = gaffa.createSpec(AccordionNode, gaffa.ContainerView);
    AccordionNode.prototype.type = viewType;
    
    AccordionNode.prototype.render = function(){
        var classes = viewType;
        
        cachedElement = cachedElement || (cachedElement = (function(){
            var header = $(document.createElement('div')).addClass("header").attr('tabindex','0'),
                content = $(document.createElement('div')).addClass("content").hide(),
                renderedElement = $(document.createElement('li')).addClass(classes).append(header, content);                
                return renderedElement[0];
        })());
        
        
        var renderedElement = cachedElement.cloneNode(true);
        
        this.views.content.element = $(renderedElement).find('.content')[0];
        this.views.header.element = $(renderedElement).find('.header')[0];
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    AccordionNode.prototype.expanded = new gaffa.Property(function() {
        var element = $(this.renderedElement);
        if(element){
            if(this.expanded.value !== false){
                element.children(".content").slideDown(200);
            }else{
                element.children(".content").slideUp(200);
            }
        }                 
    });
    
    $(document).on('activate', '.accordionNode .header', function(event){
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
        if(window.gaffa.utils.propExists(viewModel, "expanded.binding")){
            window.gaffa.model.set(viewModel.expanded.binding, window.gaffa.model.get(viewModel.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.expanded.value);
        }
    });
    
    gaffa.views[viewType] = AccordionNode;
    
})();