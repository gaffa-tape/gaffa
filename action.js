var createSpec = require('spec-js'),
    Property = require('./property'),
    ViewItem = require('./viewItem');

function Action(actionDescription){
}
Action = createSpec(Action, ViewItem);
Action.prototype.bind = function(parent){
    ViewItem.prototype.bind.call(this, parent);
};
Action.prototype.trigger = function(parent, scope, event){
    this.bind(parent);

    scope = scope || {};

    var gaffa = this.gaffa = parent.gaffa;


    for(var propertyKey in this.constructor.prototype){
        var property = this[propertyKey];

        if(property instanceof Property && property.binding){
            property.gaffa = gaffa;
            property.parent = this;
            property.value = property.get(scope);
        }
    }

    this.debind();
};

module.exports = Action;