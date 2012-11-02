//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "expandingLable";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = document.createElement('span');
        renderedElement.className = classes;
        $(renderedElement).attr('data-expanding-group-id', viewModel.properties.groupId)

        $(renderedElement).on('activate', function (e) {
            var siblings = $('span[data-expanding-group-id="' + viewModel.properties.groupId + '"]');

            siblings.animate({ "width": "350" }, "slow");

            setTimeout(function () {
                siblings.animate({ "width": "150" }, "slow")
            }, 2000);

        });

        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                text: window.gaffa.propertyUpdaters.string("text", function (viewModel, value) {
                    if(value !== null && value !== undefined){
                        viewModel.renderedElement.innerHTML = value;
                    }else{
                        viewModel.renderedElement.innerHTML = "";
                    }
                })
            },
            defaults: {
                properties: {
                    visible: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
})();