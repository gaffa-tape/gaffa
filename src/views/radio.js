//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var viewType = "radioOption",
        cachedElement;
    
    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();
    
    function createElement(viewModel) {
        var classes = viewType;
        
        var renderedElement = cachedElement || (cachedElement = (function(){
            var input = $(document.createElement('input')).attr('type','radio'),
                label = $(document.createElement('span')).addClass('radioLabel').click(function(){input.click();}),
                renderedElement = $(document.createElement('span')).addClass(viewType).append(input, label);
                return renderedElement[0];
        })());  
        
        renderedElement = renderedElement.cloneNode(true);      
        
        $(renderedElement).delegate("input", viewModel.updateEventName || "change", function(event){
            var target = $(event.target);
            if(target.attr("checked")){
                window.gaffa.model.set(viewModel.properties.checked.binding, viewModel.properties.value.value);
            }   
        });
        
        return renderedElement;
    }

    function newView() {
        
        function view() {
        }    
        
        view.prototype = {
            update: {            
                text: window.gaffa.propertyUpdaters.string("text", function(viewModel, value){
                    $(viewModel.renderedElement).children('.radioLabel').html(value);
                }),
                value: window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
                    $(viewModel.renderedElement).children('input').attr('value', value);
                }),
                name: window.gaffa.propertyUpdaters.string("name", function(viewModel, value){
                    $(viewModel.renderedElement).children('input').attr("name", value);
                }),
                checked: function(viewModel, value, firstRun) {
                    var element = $(viewModel.renderedElement).children('input');
                    if(element){
                        if(value === viewModel.properties.value.value){
                            element.attr("checked", "checked");
                        }else if(value === null || value === undefined || value === ""){
                            element.removeAttr("checked");
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
                    value: {},
                    checked: {},
                    name: {}
                }
            }
        };
        
        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);
                
        return new view();
    }
    
})();