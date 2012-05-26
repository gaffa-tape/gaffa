//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes)[0],
			form = document.createElement('form'),
			dummyTarget = document.createElement('iframe');
        
        viewModel.viewContainers.content.element = form;
				
		//All this shit doesnt work...
				
		var forms = document.getElementsByTagName("form"),
			maxId = 0,
			id = "";
		
		for(var i = 0; i < forms.length; i++){			
			var thisId = parseInt(forms[i].getAttribute("id"));
			maxId = Math.max(maxId,thisId);
		}
		
		id = "GaffaSubmitFormIframe" + (maxId + 1);
		
		dummyTarget.setAttribute("id", id);
		
		dummyTarget.setAttribute("style", "display:none;");
		
		form.setAttribute("target", id);
		form.setAttribute("action", "/favicon.ico");
		form.setAttribute("method", "post");
		
		renderedElement.appendChild(form);
		renderedElement.appendChild(dummyTarget);
		
		$(renderedElement).bind("submit", function(){
			console.log("Submitted");
		});
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();