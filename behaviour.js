var createSpec = require('spec-js'),
    ViewItem = require('./viewItem');

function Behaviour(behaviourDescription){}
Behaviour = createSpec(Behaviour, ViewItem);
Behaviour.prototype.bind = function(parent){
    ViewItem.prototype.bind.apply(this, arguments);
    if(parent){
        parent.once('debind', this.debind.bind(this));
    }
}

module.exports = Behaviour;