var test = require('grape'),
    Gaffa = require('gaffa'),
    views = {
        textbox: require('../views/textbox'),
        container: require('../views/container')
    };


test('JSONify plain textbox', function (t) {
    t.plan(1);
    var viewItem = new views.textbox(),
        viewItemJSON = JSON.stringify(viewItem),
        pojo = JSON.parse(viewItemJSON);

    t.deepEqual(pojo, {type:'textbox'});
    t.end();
});

test('JSONify textbox with value binding', function (t) {
    t.plan(1);
    var viewItem = new views.textbox(),
        viewItemJSON,
        pojo;

    viewItem.value.binding = '[thing]';

    viewItemJSON = JSON.stringify(viewItem),
    pojo = JSON.parse(viewItemJSON);

    t.deepEqual(pojo, {type:'textbox', value:{binding:'[thing]'}});
    t.end();
});

test('JSONify container with child', function (t) {
    t.plan(1);
    var viewItem = new views.container(),
        textbox = new views.textbox(),
        viewItemJSON,
        pojo;

    viewItem.views.content.add(textbox);

    viewItemJSON = JSON.stringify(viewItem),
    pojo = JSON.parse(viewItemJSON);

    t.deepEqual(pojo, {type:'container', views:{content:[{type:'textbox'}]}});
    t.end();
});