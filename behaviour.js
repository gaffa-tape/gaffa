var createSpec = require('spec-js'),
    ViewItem = require('./viewItem');

function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);
Behaviour.prototype.bind = function(parent){
    ViewItem.prototype.bind.apply(this, arguments);
}

module.exports = Behaviour;