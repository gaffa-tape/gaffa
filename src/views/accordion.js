/******************************************accordion******************************************/
(function(undefined) {
    var viewType = "accordian",
		cachedElement;
        
    function Accordian(){
        this.views.list = new gaffa.ViewContainer(this.views.list);
        this.views.empty = new gaffa.ViewContainer(this.views.empty);
    }
    Accordian = gaffa.createSpec(Accordian, gaffa.ContainerView);
    Accordian.prototype.type = viewType;
    
    Accordian.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        this.views.list.element = renderedElement;
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Accordian.prototype.list = new gaffa.Property(window.gaffa.propertyUpdaters.collection(
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
    ));
    
    gaffa.views[viewType] = Accordian;
    
})();
    
/******************************************accordionNode******************************************/
(function(undefined) {
    var viewType = "accordianNode",
		cachedElement;
    
    function AccordianNode(){
        this.type = viewType;
        this.views.content = new gaffa.ViewAccordianNode(this.views.content);
    }
    AccordianNode = gaffa.createSpec(AccordianNode, gaffa.AccordianNodeView);
    AccordianNode.prototype.type = viewType;
    
    AccordianNode.prototype.render = function(){
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
    
    AccordianNode.prototype.expanded = new gaffa.Property(function(viewModel, value, firstRun) {
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
    
    gaffa.views[viewType] = AccordianNode;
    
})();