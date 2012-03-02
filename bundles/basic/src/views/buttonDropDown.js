(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group')[0];
        
        /*
        ref: http://twitter.github.com/bootstrap/components.html
        There are 2 variances:
        1. When the button triggers the drop down
		<div class="btn-group">
          <button class="btn dropdown-toggle" data-toggle="dropdown">Action <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div>
        
        2. When the button and drop down are separate actions (i.e. button performs a different action to the ddown toggle)
		<div class="btn-group">
          <button class="btn" href="#">Action</button>
          <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div>
		*/

        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {  
                showSplitButton: function(viewModel, value, firstRun) {
                    if(viewModel.properties.showSplitButton.value !== value || firstRun){
                        viewModel.properties.showSplitButton.value = value;
                        var element = $(viewModel.renderedElement);
                        if(element){
							var button = $(document.createElement('button')).addClass('btn'),
        						toggle = $(document.createElement('button')).addClass('btn dropdown-toggle'),
        						caret = $(document.createElement('span')).addClass('caret'),
        						menu = $(document.createElement('ul')).addClass('dropdown-menu');
        					if (viewModel.properties.showSplitButton.value === true) {
        						element.append(button, toggle.append(caret), menu);	
        					} else {
        						element.append(toggle.append(caret), menu);
        					}
                        }
                    }                    
                }              
			},
            defaults: {
                viewContainers:{
                    content:[]
                },
                properties: {
                    visible: {},
                    menuItems: []
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();