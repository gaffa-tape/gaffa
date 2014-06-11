var Gaffa = require('gaffa'),
    Heading = require('gaffa-heading'),
    Text = require('gaffa-text'),
    Textbox = require('gaffa-textbox'),
    gaffa = new Gaffa();

// Register used viewItems with gaffa
gaffa.registerConstructor(Heading);
gaffa.registerConstructor(Textbox);
gaffa.registerConstructor(Text);

// create a text view
var heading = new Heading();
heading.text.binding = '(join " " "Current value of [value]:" [value])';

// create a textbox view
var textbox = new Textbox();

// Bind the textbox's value to model.value
textbox.value.binding = '[value]';

// Tell the textbox to set it's value on keyup
textbox.updateEventName = 'keyup';

var characters = new Text();
characters.text.binding = '(join " " "[value] has" (length [value]) "characters")';

// An example model
gaffa.model.set({
    value:'things'
})

// Add the view on load.
window.onload = function(){
    gaffa.views.add([
        heading,
        textbox,
        characters
    ]);
};

// Globalise gaffa for easy debugging.
window.gaffa = gaffa;