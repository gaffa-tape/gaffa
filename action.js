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
Action.prototype.complete = function(){
    this.debind();
};

module.exports = Action;