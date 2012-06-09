//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "html";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = document.createElement('span');
                
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                html: window.gaffa.propertyUpdaters.string("html", function(viewModel, value){
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