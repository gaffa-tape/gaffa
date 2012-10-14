(function(undefined) {
    var viewType = "dropdown",
		showEvents = {};
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
	
	/*
		I dislike adding styling via JS, but i dislike adding functionality via CSS.
		I think this is a good trade, as it will work without custom CSS, and it wont
		get in the way if a developer wants to override it with CSS.	
	*/
	
	gaffa.addDefaultStyle(".dropdown .content.hidden{display:none;}");

    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement('div')),
			activater = $(document.createElement('button')),
			content = $(document.createElement('div')),
			showEvent = viewModel.showEvent || 'click';
			
		activater.addClass('activator').attr('type','button');
		content.addClass('content hidden');
        renderedElement.addClass(classes + " closed");
		
		renderedElement.append(activater, content);
        
        viewModel.viewContainers.content.element = content[0];
		
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
        
        return renderedElement[0];
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            defaults: {
                viewContainers:{
                    content:[]
                },
                properties: {
                    visible: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();