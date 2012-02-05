(function(undefined) {
        
    var viewType = "textinput";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = "",
            type = "text";

		//if (gaffa.utils.propExists(viewModel, "properties.classes.value")) {
    	  //  classes += " " + viewModel.properties.classes.value;
		//}
        
        //if (gaffa.utils.propExists(viewModel, "properties.subType.value")) {
          //  type = viewModel.properties.subType.value;
        //}

        //var renderedElement = $(document.createElement('input')).attr('type', type).addClass(classes);
        var renderedElement = $(document.createElement('input')).addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.value.binding, $(this).val());    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                value: function(viewModel, value, firstRun) {
                    if (viewModel.properties.value.value !== value || firstRun) {
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.val(value);
                        }
                    }
                },
                subType: function(viewModel, value, firstRun) {
                    if (viewModel.properties.subType.value !== value || firstRun) {
                        viewModel.properties.subType.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.attr('type', value);
                        }
                    }
                },
                placeholder: function(viewModel, value, firstRun) {
                    if (viewModel.properties.placeholder.value !== value || firstRun) {
                        viewModel.properties.placeholder.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.attr('placeholder', value);
                        }
                    }              
                }
			},
            defaults: {
                properties: {
                    subType: { value: "text" },     // text | email | password
                    value: {},
                    placeholder: {},
                    classes: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();