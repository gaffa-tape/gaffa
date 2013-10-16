var test = require('tape'),
    Gaffa = require('gaffa');

var gaffa = new Gaffa();


test('extend object', function (t) {
    t.plan(1);

    var source = {hello:{things:'stuff'}},
        target = {hello:'hi'};

    t.deepEqual({hello:{things:'stuff'}}, gaffa.extend(target, source));

    t.end();
});

test('extend array', function (t) {
    t.plan(1);

    var source = [1,2,3],
        target = [];

    t.deepEqual([1,2,3], gaffa.extend(target, source));

    t.end();
});
