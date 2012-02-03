(function(undefined){
    
    //Create view
    window.views = window.views || {};
    window.views.textbox = window.views.textbox || newView();
    
    function createElement(){
        var element = $(document.createElement("input"));
        return element;
    }
    
    function newView(){
        
        function view(){            
        }
        
        view.prototype = {
            render: function(viewModel){
                var element = viewModel.renderedElement = createElement;
                
                return element;
            },
            update: function(viewModel){
                var element = viewModel.renderedElement;
                
            }
        };
        
        return new newView();
    }
})();