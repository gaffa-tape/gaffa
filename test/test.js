var Gaffa = require('gaffa'),
    gaffa = new Gaffa();

var views = {
    container: require('gaffa/views/container'),
    textbox: require('gaffa/views/textbox')
}

var testContainer = new views.container();

var textbox = new views.textbox();

textbox.value.binding = '[things]';

testContainer.views.content.add(textbox);


window.onload = function(){
	gaffa.views.add(testContainer);
};