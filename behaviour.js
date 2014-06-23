var createSpec = require('spec-js'),
    ViewItem = require('./viewItem');

function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);
Behaviour.prototype.toJSON = function(){
    return jsonConverter(this);
};

module.exports = Behaviour;