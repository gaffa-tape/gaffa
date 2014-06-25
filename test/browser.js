var Gaffa = require('gaffa'),
    Heading = require('gaffa-heading'),
    Text = require('gaffa-text'),
    Textbox = require('gaffa-textbox'),
    List = require('gaffa-list'),
    Container = require('gaffa-container'),
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

var listTemplate = new Heading();
listTemplate.text.binding = '[label]';

var list = new List();
list.list.binding = '(slice (length [value]) [items])';
list.list.template = listTemplate;


var containerBox = new Textbox();
containerBox.value.binding = 'majigger.whatsits';

var containerText = new Text();
containerText.text.binding = 'majigger.whatsits';

var container = new Container();
container.itemScope = 'majigger';
container.views.content.add([
    containerBox,
    containerText
]);

// An example model
gaffa.model.set({
    value:'things'
});

// Test lots of items
var items = [];
for (var i = 0; i < 100; i++) {
    items.push({label:'item ' + i});
};
gaffa.model.set('[items]', items);

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