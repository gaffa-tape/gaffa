(function(undefined) {
    var viewType = "dropdown",
		showEvents = {};
	
	gaffa.addDefaultStyle(".dropdown .content.hidden{display:none;}");

    function Dropdown(){
        this.views.activator = new gaffa.ViewContainer(this.views.activator);
    }
    Dropdown = gaffa.createSpec(Dropdown, gaffa.ContainerView);
    Dropdown.prototype.type = viewType;
    
    Dropdown.prototype.render = function(){
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')),
			activator = $(document.createElement('button')),
			content = $(document.createElement('div')),
			showEvent = this.showEvent || 'click';
			
		activator.addClass('activator').attr('type','button');
		content.addClass('content hidden');
        renderedElement.addClass(classes + " closed");
		
		renderedElement.append(activator, content);
        
        this.views.activator.element = activator[0];
        this.views.content.element = content[0];
		
		//Hook up any show/hide events if needed. Skip if not needed.
		showEvents[showEvent] = showEvents[showEvent] || (function(){
			$(document).on(showEvent, function(event){
				var target = $(event.target),
					clickedActivator = target.closest('.dropdown .activator'),
					clickedDropdown = target.closest('.dropdown'),
					clickedContent = target.closest('.dropdown .content'),
					allContents = $('.dropdown .content'),
					shownContent;
								
				if(clickedActivator.length && target.closest('.dropdown')[0].viewModel.showEvent === event.type){
					var targetContent = clickedDropdown.find('.content');
					
					if(targetContent.is('.hidden')){
						targetContent.removeClass('hidden');
						clickedDropdown.removeClass('closed');
					}else{
						targetContent.addClass('hidden');
						clickedDropdown.addClass('closed');
					}
					
					shownContent = targetContent;
				}
				
				if(clickedContent.length){
					shownContent = clickedContent;
				}
				
				allContents.not(shownContent).addClass('hidden').each(function(){
					$(this).closest('.dropdown').addClass('closed');
				});								
			});
			
			return true;
		})();
        
        this.views.content.element = renderedElement.find('.content')[0];
        this.views.activator.element = renderedElement.find('.activator')[0];
        
        this.renderedElement = renderedElement[0];
        
        this.__super__.render.apply(this, arguments);
    };
    
    gaffa.views[viewType] = Dropdown;
})();