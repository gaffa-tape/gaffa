var createSpec = require('spec-js'),
    Property = require('./property'),
    ViewItem = require('./viewItem');

function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.prototype.bind = function(parent, scope){
    ViewItem.prototype.bind.call(this, parent, scope);
};
Action.prototype.debind = function(){
    this.emit('debind');
    this._bound = false;
};
Action.prototype.trigger = function(){
    throw 'Nothing is implemented for this action (' + this.constructor.name + ')';
};

module.exports = Action;