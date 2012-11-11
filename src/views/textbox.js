(function (undefined) {

    var viewType = "textbox",
        cachedElement;

    window.gaffa.views = window.gaffa.views || {};
    window.gaffa.views[viewType] = window.gaffa.views[viewType] || newView();

    function setValue(event){    
        var input = this;
        var matchFail = function(){
            $(input).addClass('error');
        };
        
        $(input).removeClass('error');
                
        if ($(input).attr("type") === "number") {
            window.gaffa.propertyUpdaters.string(input.viewModel, input.viewModel.properties.value, parseFloat($(input).val()), matchFail);
        } else {
            window.gaffa.propertyUpdaters.string(input.viewModel, input.viewModel.properties.value, $(input).val(), matchFail);
        } 
    }  
    
    function createElement(viewModel) {
        var classes = viewType;

        var renderedElement = cachedElement || (cachedElement = document.createElement('input'));

        if (viewModel.properties.name.value) {
            renderedElement.setAttribute("name", viewModel.properties.name.value)
        }

        renderedElement = $(renderedElement.cloneNode(true)).addClass(classes)[0];
                
        $(renderedElement).bind(viewModel.updateEventName || "change", setValue);

        return renderedElement;
    }

    function newView() {

        function view() {
        }

        view.prototype = {
            update: {
                value: window.gaffa.propertyUpdaters.string("value", function(viewModel, value){
                
                    var element = viewModel.renderedElement,
                        caretPosition = 0,
                        $element = $(element),
                        originalValue = $element.val(),
                        hasCaret = $element.is(':focus'); //this is only necissary because IE10 is a pile of crap (i know what a supprise)
                        
                    if(originalValue === value){
                        return;
                    }

                    // Inspiration taken from http://stackoverflow.com/questions/2897155/get-caret-position-within-an-text-input-field
                    // but WOW is that some horrendous code! Max <http://stackoverflow.com/users/43677/max> should feel bad.
                    // hungarian notation in JS, mixing between explicit and implicit braces in an if-else
                    // spaces between function and call parenthesies...
                    // And you couldn't afford yo type 'Position'?? wtf, was 'ition' that much more that you couldn't type it?!
                    // iSel.... WHAT THE FUCK IS THAT? I assumed selection, but FUCK, just type 'selection'!
                    // Just wow.
                    if(hasCaret){
                        if (document.selection) {
                            var selection = document.selection.createRange();
                            selection.moveStart('character', -element.value.length);
                            caretPosition = selection.text.length;
                        }
                        else if (element.selectionStart || element.selectionStart == '0'){
                            caretPosition = element.selectionStart; 
                        }       
                    }
                    
                    $element.val(value);                    
                    
                    if(hasCaret){
                        if(element.createTextRange) {
                            var range = element.createTextRange();
                                
                            range.move('character', caretPosition);   
                            
                            range.select();
                        }
                        if(element.selectionStart) {
                            element.setSelectionRange(caretPosition, caretPosition);
                        }
                    }
                    
                }),
                subType: window.gaffa.propertyUpdaters.string("subType", function(viewModel, value){
                    $(viewModel.renderedElement).attr('type', value);
                }),
                placeholder: window.gaffa.propertyUpdaters.string("placeholder", function(viewModel, value){
                    $(viewModel.renderedElement).attr('placeholder', value);
                }),
                disabled: window.gaffa.propertyUpdaters.bool("disabled", function(viewModel, value){
                    if (value)
                    {
                        viewModel.renderedElement.setAttribute('disabled', 'disabled');
                    }else{
                        viewModel.renderedElement.removeAttribute('disabled');
                    }
                })
            },
            defaults: {
                properties: {
                    value: {},
                    subType: {},
                    placeholder: {},
                    disabled: {}
                }
            }
        };

        $.extend(true, view.prototype, window.gaffa.views.base(viewType, createElement), view.prototype);

        return new view();
    }
})();