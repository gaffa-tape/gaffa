//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('type', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        viewModel.properties.list.value = value;
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
                    visible: {},                
                    list: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'text').addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('type', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        viewModel.properties.list.value = value;
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
                    visible: {},                
                    list: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'text').addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('ul'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "anchor";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('a')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                },
                href: function(viewModel, value, firstRun) {
                    if(viewModel.properties.href.value !== value || firstRun){
                        viewModel.properties.href.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.attr("href", value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();/******************************************accordion******************************************/

//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "accordion",
        cachedElement;
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        renderedElement = $(renderedElement.cloneNode()).addClass(classes).kendoAutoComplete();
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                                                
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template.type === "accordionNode"){
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
    var viewType = "accordionNode",
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
                        var element = viewModel.renderedElement;
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
        
    $(window).delegate('.accordionNode .header', "click", function(event){
        var accordionNode = $(event.target).closest('.accordionNode');
        accordionNode.siblings().each(function(){
            var viewModel = this.viewModel;
            if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
                window.gaffa.model.set(viewModel.properties.expanded.binding, false);
            }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
                window.gaffa.views[viewType].update.expanded(viewModel, false);
            }
        });        
        var viewModel = accordionNode[0].viewModel;
        if(window.gaffa.utils.propExists(viewModel, "properties.expanded.binding")){
            window.gaffa.model.set(viewModel.properties.expanded.binding, window.gaffa.model.get(viewModel.properties.expanded.binding));
        }else if(window.gaffa.utils.propExists(viewModel, "properties.expanded.value")){
            window.gaffa.views[viewType].update.expanded(viewModel, !viewModel.properties.expanded.value);
        }
    });
    
    $(window).delegate('.accordionNode .header', "keydown", function(event){
        if(event.which == "13"){
            $(event.target).click();
        }
    });
    
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "button";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('button')).attr('button', 'text').addClass(classes);
                
        viewModel.viewContainers.content.element = renderedElement;
        
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
				viewContainers:{
					content:[]
				},
                properties: {
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
    
    $(document).delegate('button', 'click', function(event){
        event.preventDefault();
    });
    
})();(function(undefined) {
    var viewType = "buttonDropDown";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass('btn-group');
        
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
                        var element = viewModel.renderedElement;
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
})();(function(undefined) {
    var viewType = "buttonGroup";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = "btn-group";
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {                
			},
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
})();//    Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('input')).attr('type', 'checkbox').addClass(classes);
        
        $(renderedElement).bind("change", function(){
            window.gaffa.model.set(viewModel.properties.checked.binding, renderedElement.attr("checked") === "checked");    
        });
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
                checked: function(viewModel, value, firstRun) {
                    if(viewModel.properties.checked.value !== value || firstRun){
                        viewModel.properties.checked.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            if(value){
                                element.attr("checked", "checked");
                            }else{
                                element.removeAttr("checked");
                            }
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    checked:{}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "code";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('code')).addClass(classes).attr('tabindex','0');
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
            update: {
                code: function(viewModel, value, firstRun) {
                    if(viewModel.properties.code.value !== value || firstRun || value.isArray){
                        viewModel.properties.code.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.text(value);
                        }
                    }                    
                }
            },
            defaults: {
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "container";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
        
		return renderedElement;
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "form";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('form')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
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
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "heading";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('h1')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "label";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "linebreak";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('br')).addClass(classes);
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    href: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();(function(undefined) {
    var viewType = "list";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('div')).addClass(classes);
        
        viewModel.viewContainers.list.element = renderedElement;
        
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {             
                list: function(viewModel, value, firstRun) {
                    if(value && value.length && (viewModel.properties.list.value.length !== value.length || firstRun)){
                        
                        //Cant set it to the value, that would cause both to be a reference to the same array,
                        //so their lenghts would always be the same, and this code would never execute again.
                        // .slice(); returns a new array.
                        viewModel.properties.list.value = value.slice();
                        
                        var element = viewModel.renderedElement;
                        if(element && viewModel.properties.list.template){
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
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "nav";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
        var classes = "navbar";

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
                            element.find('a').html(value);
                        }
                    }                    
                },
                fixed: function(viewModel, value, firstRun){
                    if(viewModel.properties.fixed.value !== value || firstRun){
                        viewModel.properties.fixed.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                           if (viewModel.properties.fixed.value)
                            {
                                element.addClass("navbar-fixed-top");
                            }
                        }
                    } 
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if(element){                            
                            element.removeClass("pull-right pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                				case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                					element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }                     
                }
			},
            defaults: {
                properties: {
                    text: {},
                    alignment: {},
                    fixed: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "paragraph";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('p')).addClass(classes);
        
        viewModel.viewContainers.content.element = renderedElement;
                
		return renderedElement;
	}

	function newView() {
		
		function view() {
		}	
		
		view.prototype = {
			update: {
			},
            defaults: {
                viewContainers:{
                    content:[]
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		text: quote
//		cite: citation
//		citeHref: cittation link
(function(undefined) {
    var viewType = "quote";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;

        var paragraph = $(document.createElement('p')),
            small = $(document.createElement('small')),
            cite = $(document.createElement('cite')),
			renderedElement = $(document.createElement('blockquote')).addClass(classes).append(paragraph).append(small.append(cite));
                
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
                            element.children('p').html(value);
                        }
                    }                    
                },
                cite: function(viewModel, value, firstRun) {
                    if (!viewModel.properties.citeHref.value)
                    {
	                    if(viewModel.properties.cite.value !== value || firstRun){
	                        viewModel.properties.cite.value = value;
	                        var element = viewModel.renderedElement;
	                        if (element) {
	                            element.find('cite').html(value);
	                        }
	                    }
                    }                    
                },
                citeHref: function(viewModel, value, firstRun) {
                    if(viewModel.properties.citeHref.value !== value || firstRun){
                        viewModel.properties.citeHref.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.find('cite').append($(document.createElement('a')).text(viewModel.properties.cite.value).attr('href', value).attr('target', '_blank'));

                        }
                    }                    
                },
                alignment: function(viewModel, value, firstRun){
                    if(viewModel.properties.alignment.value !== value || firstRun){
                        viewModel.properties.alignment.value = value;
                        var element = viewModel.renderedElement;
                        if (element) {
                            element.removeClass("pull-right").removeClass("pull-left");
                            switch (viewModel.properties.alignment.value)
                    		{
                                case "right":
                					element.addClass("pull-right");
                					break;
                				case "left":
                    				element.addClass("pull-left");
                					break;
                				default:
                                    break;
                            }
                        }
                    }
                }
			},
            defaults: {
                properties: {
                    visible: {},
                    text: {},
                    cite: {},
                    citeHref: {},
                    alignment: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//	Properties:
//		styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "text";
    
	window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('span')).addClass(classes);
                
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
                            element.html(value);
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
                    visible: {},
                    text: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textarea";
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = $(document.createElement('textarea')).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();//    Properties:
//    	styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "textbox",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
	window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

	function createElement(viewModel) {
		var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));
        
        renderedElement = $(renderedElement.cloneNode()).addClass(classes);
        
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
                    if(viewModel.properties.value.value !== value || firstRun){
                        viewModel.properties.value.value = value;
                        var element = viewModel.renderedElement;
                        if(element){
                            element.val(value);
                        }
                    }                    
                }
			},
            defaults: {
                properties: {
                    value: {}
                }
            }
		};
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
        
		return new view();
	}
})();