var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    jsonConverter = require('./jsonConverter'),
    Property = require('./property'),
    merge = require('merge');

function copyProperties(source, target){
    if(
        !source || typeof source !== 'object' ||
        !target || typeof target !== 'object'
    ){
        return;
    }

    for(var key in source){
        if(source.hasOwnProperty(key)){
            target[key] = source[key];
        }
    }
}

function inflateViewItem(viewItem, description){
    var ViewContainer = require('./viewContainer');

    for(var key in viewItem){
        if(viewItem[key] instanceof Property){
            viewItem[key] = new viewItem[key].constructor(viewItem[key]);
        }
    }

    /**
        ## .actions

        All ViewItems have an actions object which can be overriden.

        The actions object looks like this:

            viewItem.actions = {
                click: [action1, action2],
                hover: [action3, action4]
            }

        eg:

            // Some ViewItems
            var someButton = new views.button(),
                removeItem = new actions.remove();

            // Set removeItem as a child of someButton.
            someButton.actions.click = [removeItem];

        If a Views action.[name] matches a DOM event name, it will be automatically _bound.

            myView.actions.click = [
                // actions to trigger when a 'click' event is raised by the views renderedElement
            ];
    */
    viewItem.actions = viewItem.actions ? clone(viewItem.actions) : {};

    for(var key in description){
        var prop = viewItem[key];
        if(prop instanceof Property || prop instanceof ViewContainer){
            copyProperties(description[key], prop);
        }else{
            viewItem[key] = description[key];
        }
    }
}

/**
    ## ViewItem

    The base constructor for all gaffa ViewItems.

    Views, Behaviours, and Actions inherrit from ViewItem.
*/
function ViewItem(viewItemDescription){
    inflateViewItem(this, viewItemDescription);
}
ViewItem = createSpec(ViewItem, Bindable);

    /**
        ## .path

        the base path for a viewItem.

        Any bindings on a ViewItem will recursivly resolve through the ViewItems parent's paths.

        Eg:

            // Some ViewItems
            var viewItem1 = new views.button(),
                viewItem2 = new actions.set();

            // Give viewItem1 a path.
            viewItem1.path = '[things]';
            // Set viewItem2 as a child of viewItem1.
            viewItem1.actions.click = [viewItem2];

            // Give viewItem2 a path.
            viewItem2.path = '[stuff]';
            // Set viewItem2s target binding.
            viewItem2.target.binding = '[majigger]';

        viewItem2.target.binding will resolve to:

            '[/things/stuff/majigger]'
    */
ViewItem.prototype.path = '[]';
ViewItem.prototype.bind = function(parent, scope){

    var viewItem = this,
        property;


    this.parent = parent;
    this.scope = merge(false, scope, this.scope);
    this.gaffa = parent && parent.gaffa || this.gaffa;

    Bindable.prototype.bind.apply(this, arguments);

    // Only set up properties that were on the prototype.
    // Faster and 'safer'
    for(var propertyKey in this.constructor.prototype){
        property = this[propertyKey];
        if(property instanceof Property){
            property.bind(this, this.scope);
        }
    }

    // Create item scope
};
ViewItem.prototype.remove = function(){
    if(this.parentContainer){
        var index = this.parentContainer.indexOf(this);
        if(index >= 0){
            this.parentContainer.splice(index, 1);
        }
        this.parentContainer = null;
    }

    this.emit('remove');

    this.debind();

    this.destroy();
};
ViewItem.prototype.triggerActions = function(actionName, scope, event){
    if(!this._bound){
        return;
    }
    scope = merge(false, this.scope, scope);
    this.gaffa.actions.trigger(this.actions[actionName], this, scope, event);
};

module.exports = ViewItem;