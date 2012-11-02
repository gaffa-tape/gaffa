(function (undefined) {
    var viewType = "modal";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType,
            renderedElement = document.createElement('div'),
			modal = document.createElement('section'),
			content = document.createElement('div'),
			header = document.createElement('header'),
			footer = document.createElement('footer'),
			closeButton = document.createElement('button');
			
        renderedElement.appendChild(modal);
        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        header.appendChild(closeButton);
		
        $(modal).hide();
        $(renderedElement).hide();
		
        renderedElement.className = "modalWrapper";
        modal.className = classes;
        closeButton.className = "closeButton";

        
        viewModel.viewContainers.content.element = content;
        gaffa.model.set(viewModel.properties.show.binding, false);
        return renderedElement;
    }
	
    function showModal(viewModel, show){
        var $renderedElement = $(viewModel.renderedElement),
			$modal = $renderedElement.children();
			
        if(show){
            $renderedElement.fadeIn(200);
            $modal.slideDown(200);
        }else{
            $renderedElement.fadeOut(200);
            $modal.slideUp(200);		
        }
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                show: window.gaffa.propertyUpdaters.bool(
                    "show", 
                    function(viewModel, value){
                        showModal(viewModel, value);
                    })
            },
            defaults: {
                viewContainers:{
                    content:[]
                },
                properties: {
                    visible: {},
                    show: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        // HACK: Make modalWrapper invisible on load
        view.prototype.update.visible = false;

        $(document).on('activate', '.modal .closeButton', function (event) {

            var viewModel = $(this).closest('.modalWrapper')[0].viewModel;
            gaffa.model.set(viewModel.properties.show.binding, false);
        }).on('activate', '.modalWrapper', function (event) {

            if ($(event.target).is('.modalWrapper')) {
                var viewModel = $(this).closest('.modalWrapper')[0].viewModel;
                gaffa.model.set(viewModel.properties.show.binding, false);
            }
        });

        return new view();
    }
})();