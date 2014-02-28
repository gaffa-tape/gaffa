var Gaffa = require('gaffa'),
    crel = require('crel'),
    viewType = "textbox",
    doc = require('doc-js');

function setValue(event){
    var input = event.target,
        viewModel = input.viewModel;

    if (viewModel.subType.value === "number") {
        viewModel.value.set(parseFloat(input.value));
    } else {
        viewModel.value.set(input.value);
    }
}

function updateValue(viewModel, value){

    value = value || '';


    var element = viewModel.renderedElement,
        caretPosition = 0,
        hasCaret = element === document.activeElement; //this is only necissary because IE10 is a pile of crap (i know what a surprise)

    // Skip if the text hasnt changed
    if(value === element.value){
        return;
    }

    // Inspiration taken from http://stackoverflow.com/questions/2897155/get-caret-position-within-an-text-input-field
    // but WOW is that some horrendous code!
    // hungarian notation in JS, mixing between explicit and implicit braces in an if-else
    // spaces between function and call parenthesies...
    // And you couldn't afford yo type 'Position'?? wtf, was 'ition' that much more that you couldn't type it?!
    // iSel.... WHAT THE FUCK IS THAT? I assumed selection, but FUCK, just type 'selection'!
    // Just wow.
    if(hasCaret){
        if (window.document.selection) {
            var selection = window.document.selection.createRange();
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
}

function updateSubType(viewModel, value){
    viewModel.renderedElement.setAttribute('type', value != null ? value : "");
}

function updatePlaceholder(viewModel, value){
    viewModel.renderedElement.setAttribute('placeholder', value != null ? value : "");
}

function updateDisabled(viewModel, value){
    if (value){
        viewModel.renderedElement.setAttribute('disabled', 'disabled');
    }else{
        viewModel.renderedElement.removeAttribute('disabled');
    }
}

function updateRequired(viewModel, value){
    if (value){
        viewModel.renderedElement.setAttribute('required', 'required');
    }else{
        viewModel.renderedElement.removeAttribute('required');
    }
}

function Textbox(){}
Textbox = Gaffa.createSpec(Textbox, Gaffa.View);
Textbox.prototype.type = viewType;

Textbox.prototype.render = function(){
    var renderedElement = crel('input'),
        updateEventNames = (this.updateEventName || "change").split(' ');

    this._removeHandlers.push(this.gaffa.events.on(this.updateEventName || "change", renderedElement, setValue));

    this.renderedElement = renderedElement;

};

Textbox.prototype.value = new Gaffa.Property(updateValue);

Textbox.prototype.subType = new Gaffa.Property(updateSubType);

Textbox.prototype.placeholder = new Gaffa.Property(updatePlaceholder);

Textbox.prototype.disabled = new Gaffa.Property(updateDisabled);

Textbox.prototype.required = new Gaffa.Property(updateRequired);

module.exports = Textbox;