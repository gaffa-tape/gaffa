//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";
    	if (gaffa.utils.propExists(viewModel, "properties.classes.value")) {
            classes += " " + viewModel.properties.classes.value;
		}
        if (gaffa.utils.propExists(viewModel, "properties.fixed.value")) {
            if (viewModel.properties.fixed.value)
            {
                classes += " navbar-fixed-top";
            }
        }else if (gaffa.utils.propExists(viewModel, "properties.alignment.value")) {
			switch (viewModel.properties.alignment.value)
			{
				case "right":
					classes += " pull-right";
					break;
				case "left":
					classes += " pull-left";
					break;
				default:
                    break;
            }
		}

        var mainBar = $(document.createElement('div')).addClass(classes),
            innerBar = $(document.createElement('div')).addClass('navbar-inner'),
            container = $(document.createElement('div')).addClass('container'),
            brand = $(document.createElement('a')).addClass('brand').attr('href', '#'),
			renderedElement = mainBar.append(innerBar.append(container.append(brand)));
        
        //viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                text: function(viewModel, value, firstRun) {
                    if(viewModel.properties.text.value !== value || firstRun){
                        viewModel.properties.text.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.find('a').text(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();