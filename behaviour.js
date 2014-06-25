var createSpec = require('spec-js'),
    ViewItem = require('./viewItem');

function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);

module.exports = Behaviour;