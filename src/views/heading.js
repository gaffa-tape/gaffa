(function(undefined) {
    var viewType = "heading";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = $(document.createElement(viewModel.level || 'h1')).addClass(classes)[0];
                
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
                    if(typeof value === "string"){
                        viewModel.renderedElement.innerHTML = value;
                    }else{
                        viewModel.renderedElement.innerHTML = "";
                    }
                })
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
})();