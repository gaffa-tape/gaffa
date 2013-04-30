(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        crel = require('crel'),
        viewType = "textbox",
		cachedElement;
    
    function matchFail(element, failed){
        if(failed){
            if(element.className.indexOf('error') >= 0){
                return;
            }
            element.className += ' error'
            element.className.trim();
        }else{
            element.className.indexOf('error') >= 0 && element.className.replace(/error/g,'');
        }
    }
        
    function setValue(event){    
        var input = this,
            viewModel = input.viewModel;
                
        if (viewModel.subType.value === "number") {
            viewModel.value.set(parseFloat(input.value));
        } else {
            viewModel.value.set(input.value);
        } 
    }  
    
    var updateValue = Gaffa.propertyUpdaters.string(function(viewModel, value){
                
        var element = viewModel.renderedElement,
            caretPosition = 0,
            hasCaret = element.focus; //this is only necissary because IE10 is a pile of crap (i know what a surprise)

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
        
        element.value = value;                    
        
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
        
    });
    
    var updateSubType = Gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.setAttribute('type', value);
    });
    
    var updatePlaceholder = Gaffa.propertyUpdaters.string(function(viewModel, value){
        viewModel.renderedElement.setAttribute('placeholder', value);
    });
    
    var updateDisabled = Gaffa.propertyUpdaters.bool(function(viewModel, value){
        if (value){
            viewModel.renderedElement.setAttribute('disabled', 'disabled');
        }else{
            viewModel.renderedElement.removeAttribute('disabled');
        }
    });
    
    function Textbox(){}
    Textbox = Gaffa.createSpec(Textbox, Gaffa.View);
    Textbox.prototype.type = viewType;
    
    Textbox.prototype.render = function(){
        var renderedElement = crel('input'),
            updateEventNames = (this.updateEventName || "change").split(' ');
                
        fastEach(updateEventNames, function (eventName) {
            renderedElement.addEventListener(eventName, setValue);            
        });
        
        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    };
    
    Textbox.prototype.value = new Gaffa.Property(updateValue);
    
    Textbox.prototype.subType = new Gaffa.Property(updateSubType);
    
    Textbox.prototype.placeholder = new Gaffa.Property(updatePlaceholder);
    
    Textbox.prototype.disabled = new Gaffa.Property(updateDisabled);

    return Textbox;
    
}));