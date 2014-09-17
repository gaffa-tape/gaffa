var createSpec = require('spec-js'),
    Property = require('./property'),
    statham = require('statham'),
    ViewItem = require('./viewItem');

function triggerAction(action, parent, scope, event) {
    // clone
    action = parent.gaffa.initialiseAction(statham.revive(JSON.parse(statham.stringify(action))));

    action.bind(parent, scope);

    scope || (scope = {});

    if(action.condition.value){
        action.trigger(parent, scope, event);
    }

    action.debind();
}

function triggerActions(actions, parent, scope, event) {
    if(Array.isArray(actions)){
        for(var i = 0; i < actions.length; i++) {
            triggerAction(actions[i], parent, scope, event);
        }
    }else if(actions instanceof Action){
        triggerAction(actions, parent, scope, event);
    }
}

function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.trigger = triggerActions;
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
    if(this._async && !this._complete){
        return this.on('complete', this.debind.bind(this));
    }
    ViewItem.prototype.debind.call(this);
    this.complete();
};
Action.prototype.complete = function(){
    if(this._complete){
        return;
    }
    this._complete = true;
    this.emit('complete');
    this.debind();
};

module.exports = Action;