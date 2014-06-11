var Gaffa = require('../'),
    Text = require('gaffa-text'),
    Textbox = require('gaffa-textbox'),
    gaffa = new Gaffa();

// Register used viewItems with gaffa
gaffa.registerConstructor(Text);
gaffa.registerConstructor(Textbox);

// create a button to test with
var text = new Text();
text.text.binding = '(join " " "Current value of [value]:" [value])';

// create a button to test with
var textbox = new Textbox();
textbox.value.binding = '[value]';

// An example model
gaffa.model.set({
    value:'things'
})

// Add the view on load.
window.onload = function(){
    gaffa.views.add([
        text,
        textbox
    ]);
};

// Globalise gaffa for easy debugging.
window.gaffa = gaffa;