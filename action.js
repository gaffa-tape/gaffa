var createSpec = require('spec-js'),
    Property = require('./property'),
    statham = require('statham'),
    ViewItem = require('./viewItem');

function triggerAction(action, parent, scope, event) {
    // clone
    action = parent.gaffa.initialiseAction(statham.revive(JSON.parse(statham.stringify(action))));

    action.on('bind', function(parent, scope){
        action.path = action.getPath();

        scope || (scope = {});

        if(action.condition.value){
            action.trigger(parent, scope, event);
        }

        if(!action._async){
            action.complete();
        }
    });

    action.bind(parent, scope);
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

// Because actions shouldn't neccisarily debind untill they are complete,
// They have an odd debind impementation.
Action.prototype.debind = function(){
    if(!this._complete && !this._destroyed){
        return;
    }
    this.complete();
};
Action.prototype.complete = function(){
    if(this._complete){
        return;
    }

    this._complete = true;
    var action = this;
    this.on('debind', function(){
        action.destroy();
    });
    this.emit('complete');
    ViewItem.prototype.debind.call(this);
};

// Only actually destroy if either the actions parent was not an Action,
// Or if its Action parent was explicitly destroyed.
Action.prototype.destroy = function(){
    if(!this._complete && (this.parent instanceof Action ? this.parent._canceled : true)){
        this._canceled = true;
    }

    if(!this._complete && !this._canceled){
        return;
    }

    ViewItem.prototype.destroy.call(this);
};

module.exports = Action;