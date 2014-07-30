var createSpec = require('spec-js'),
    Property = require('./property'),
    ViewItem = require('./viewItem');

function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.prototype.trigger = function(){
    throw 'Nothing is implemented for this action (' + this.constructor.name + ')';
};
Action.prototype.condition = new Property({
    value: true
});
Action.prototype.debind = function(){
    // Some actions are asynchronous.
    // They should not debind until they are truely complete,
    // or they are destroyed.
    if(!this._async || this._destroyed){
        this.complete();
    }
};
Action.prototype.complete = function(){
    ViewItem.prototype.debind.apply(this, arguments);
};

module.exports = Action;