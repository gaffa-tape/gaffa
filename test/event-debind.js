var Gaffa = require('gaffa'),
    Set = require('gaffa-set'),
    Button = require('gaffa-button'),
    gaffa = new Gaffa();

// Register used viewItems with gaffa
gaffa.registerConstructor(Set);
gaffa.registerConstructor(Button);

var set = new Set();
set.source.binding = '(Math.random)';
set.target.binding = '[value]';

var button = new Button();
button.text.binding = '[value]';
button.actions.click = [set];

// Add the view on load.
window.onload = function(){
    gaffa.views.add([
        heading,
        textbox,
        characters,
        list,
        container
    ]);
};

// Globalise gaffa for easy debugging.
window.gaffa = gaffa;