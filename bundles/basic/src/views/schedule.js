(function(undefined) {
    var viewType = "schedule",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('div'));
        
        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if (value && value.isArray && (viewModel.properties.list.value.length !== value.length || firstRun)) {
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = $(viewModel.renderedElement);
                        if(element && viewModel.properties.list.template.type === "scheduleNode"){
                            var listViews = viewModel.viewContainers.list;
                            while(value.length < listViews.length){
                                viewModel.viewContainers.list.pop().renderedElement.remove();
                            }
                            while(value.length > listViews.length){
                                window.gaffa.views.add($.extend(true, {}, viewModel.properties.list.template), viewModel, listViews, listViews.length);
                            }
                            window.gaffa.views.render(viewModel.viewContainers.list, viewModel.viewContainers.list.element);
                        }
                    }else if(value && value.length === 0){
                        while(viewModel.viewContainers.list.length){
                            viewModel.viewContainers.list.pop().renderedElement.remove();
                        }
                    }
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
    
/******************************************accordionNode******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "scheduleNode",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = (function(){
            var header = $(document.createElement('div')).addClass("header").attr('tabindex','0'),
                content = $(document.createElement('div')).addClass("content").hide(),
                renderedElement = $(document.createElement('li')).addClass(classes).append(header, content);                
                return renderedElement[0];
        })());
        
        
        renderedElement = $(renderedElement.cloneNode(true));
        
        viewModel.viewContainers.content.element = renderedElement.children('.content');
        viewModel.viewContainers.header.element = renderedElement.children('.header');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {                            
                expanded: function(viewModel, value, firstRun) {
                    if(viewModel.properties.expanded.value !== value || firstRun){
                        viewModel.properties.expanded.value = value;
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
                viewContainers:{
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
        
    $(window).delegate('.scheduleNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.scheduleNode');
        accordionNode.siblings().each(function() {
            var viewModel = this.viewModel;
            if (window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")) {
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            } else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")) {
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if (window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        } else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.scheduleNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
})();