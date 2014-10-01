var Gaffa = require('gaffa'),
    Set = require('gaffa-set'),
    Push = require('gaffa-push'),
    Button = require('gaffa-button'),
    List = require('gaffa-list'),
    gaffa = new Gaffa();

// Register used viewItems with gaffa
gaffa.registerConstructor(Set);
gaffa.registerConstructor(Push);
gaffa.registerConstructor(Button);
gaffa.registerConstructor(List);

var set = new Set();
set.source.binding = '(array "first")';
set.target.binding = '[/values]';

var addValue = new Push();
addValue.source.binding = '(math.random)';
addValue.target.binding = '[/values]';

var button = new Button();
button.text.binding = '[]';
button.actions.mouseup = [set];
button.actions.click = [addValue];

var buttonList = new List();
buttonList.list.template = button;
buttonList.list.binding = '[values]';

// Add the view
gaffa.views.add([
    buttonList
]);

gaffa.model.set({
    values:['first']
});

// Globalise gaffa for easy debugging.
window.gaffa = gaffa;