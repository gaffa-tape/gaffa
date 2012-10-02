//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
        
    var viewType = "checkbox";
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = document.createElement('span'),        
            label = document.createElement('label'),
            checkboxId = parseInt(Math.random() * 100000), //Dodgy as.... don't like it? submit a pull request.
            checkbox = $(document.createElement('input')).attr('type', 'checkbox').attr('id', checkboxId)[0];
        
        $(checkbox).bind(viewModel.updateEventName || "change", function(event){
            var viewModel = $(this).parent()[0].viewModel;
            window.gaffa.propertyUpdaters.bool(viewModel, viewModel.properties.checked, $(this).is(":checked"));            
        });     
        label.setAttribute('for', checkboxId);
        renderedElement.appendChild(checkbox);
        renderedElement.appendChild(label);
        renderedElement.className = classes;
                
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {
                checked: function(viewModel) {   
                    if(viewModel.properties.checked.value){
                        $(viewModel.renderedElement).children('input').attr("checked", "checked");      
                    }else{
                        $(viewModel.renderedElement).children('input').removeAttr("checked");      
                    }
                },
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
                    if(value !== null && value !== undefined){
                        viewModel.renderedElement.getElementsByTagName('label')[0].innerText = value;
                    }else{
                        viewModel.renderedElement.getElementsByTagName('label')[0].innerText = "";
                    }
                })
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
})();