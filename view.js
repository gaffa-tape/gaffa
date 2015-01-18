/**
    ## View

    A base constructor for gaffa Views that have content view.

    All Views that inherit from ContainerView will have:

        someView.views.content
*/

var createSpec = require('spec-js'),
    doc = require('doc-js'),
    crel = require('crel'),
    laidout = require('laidout'),
    ViewItem = require('./viewItem'),
    Property = require('./property'),
    createModelScope = require('./createModelScope'),
    getClosestItem = require('./getClosestItem'),
    Consuela = require('consuela'),
    Behaviour = require('./behaviour');

function insertFunction(selector, renderedElement, insertIndex){
    var target = ((typeof selector === "string") ? document.querySelectorAll(selector)[0] : selector),
        referenceSibling;

    if(target && target.childNodes){
        referenceSibling = target.childNodes[insertIndex];
    }
    if(referenceSibling){
        if(referenceSibling === renderedElement){
            // don't do anything, element is already in the correct location.
            return;
        }
        target.insertBefore(renderedElement, referenceSibling);
    }else{
        target.appendChild(renderedElement);
    }
}

function langify(fn, context){
    return function(scope, args){
        var args = args.all();

        return fn.apply(context, args);
    }
}

function createEventedActionScope(view, event){
    var scope = createModelScope(view);

    scope.event = {
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        which: event.which,
        target: event.target,
        targetViewItem: getClosestItem(event.target),
        preventDefault: langify(event.preventDefault, event),
        stopPropagation: langify(event.stopPropagation, event)
    };

    return scope;
}

function bindViewEvents(view){
    for(var key in view.actions){
        var actions = view.actions[key],
            off;

        if(actions._eventsBound){
            continue;
        }

        actions._eventsBound = true;

        bindViewEvent(view, key);
    }
}

function bindViewEvent(view, eventName){
    return view.gaffa.events.on(eventName, view.renderedElement, function (event) {
        view.triggerActions(eventName, createEventedActionScope(view, event), event);
    });
}

function View(viewDescription){
    var view = this;

    view.behaviours = view.behaviours || [];
    this.consuela = new Consuela();

    this.on('bind', function(parent, scope){
        var isRebind = this._rebind;

        watchElements(this);
        bindViewEvents(this);
        if(!isRebind){
            this.triggerActions('load');
            
            if(!this._bound) {
                return;
            }
            
            var view = this,
                onDetach = this.detach.bind(this);

            parent.once('detach', onDetach);
            this.once('destroy', function(){
                view.parent.removeListener('detach', onDetach);
            });
        }
        bindBehaviours(this, scope);
    });

    this.on('debind', function () {
        this.triggerActions('unload');

        for(var key in this.actions){
            this.actions[key]._eventsBound = null;
        }

        this.consuela.cleanup();
    });
}
View = createSpec(View, ViewItem);

function watchElements(view){
    for(var key in view){
        if(!view.hasOwnProperty(key)){
            return;
        }
        if(crel.isElement(view[key])){
            view.consuela.watch(view[key]);
        }
    }
}

function bindBehaviours(view, scope){
    for(var i = 0; i < view.behaviours.length; i++){
        Behaviour.prototype.bind.call(view.behaviours[i], view, scope);
        if(view.behaviours[i].bind !== Behaviour.prototype.bind){
            view.behaviours[i].bind(view, scope);
        }
    }
}

View.prototype.rebind = function(parent, scope){
    parent = parent || this.parent;
    scope = scope || this.scope;
    this._rebind = true;
    this.bind(parent, scope);
    this._rebind = null;
};
View.prototype.detach = function(){
    this.renderedElement && this.renderedElement.parentNode && this.renderedElement.parentNode.removeChild(this.renderedElement);
};

View.prototype.remove = function(){
    this.detach();
    this.emit('detach');
    ViewItem.prototype.remove.call(this);
}

View.prototype.destroy = function() {
    this.detach();
    ViewItem.prototype.destroy.call(this);

    for(var key in this){
        if(crel.isElement(this[key])){
            this[key] = null;
        }
    }
};

View.prototype.render = function(){};

function insert(view, viewContainer, insertIndex){
    var gaffa = view.gaffa,
        renderTarget = view.insertSelector || view.renderTarget || viewContainer && viewContainer.element || gaffa.views.renderTarget;

    if(view.afterInsert){
        laidout(view.renderedElement, function(){
            view.afterInsert();
        });
    }

    view.insertFunction(view.insertSelector || renderTarget, view.renderedElement, insertIndex);
}

View.prototype.insert = function(viewContainer, insertIndex){
    insert(this, viewContainer, insertIndex);
};

function Classes(){};
Classes = createSpec(Classes, Property);
Classes.prototype.update = function(view, value){
    doc.removeClass(view.renderedElement, this._previousClasses);
    this._previousClasses = value;
    doc.addClass(view.renderedElement, value);
};
View.prototype.classes = new Classes();

function Visible(){};
Visible = createSpec(Visible, Property);
Visible.prototype.value = true;
Visible.prototype.update = function(view, value) {
    view.renderedElement.style.display = value ? '' : 'none';
};
View.prototype.visible = new Visible();

function Enabled(){};
Enabled = createSpec(Enabled, Property);
Enabled.prototype.value = true;
Enabled.prototype.update = function(view, value) {
    if(!value === !!view.renderedElement.getAttribute('disabled')){
        return;
    }
    view.renderedElement[!value ? 'setAttribute' : 'removeAttribute']('disabled','disabled');
};
View.prototype.enabled = new Enabled();

function Title(){};
Title = createSpec(Title, Property);
Title.prototype.update = function(view, value) {
    view.renderedElement[value ? 'setAttribute' : 'removeAttribute']('title',value);
};
View.prototype.title = new Title();

View.prototype.insertFunction = insertFunction;

module.exports = View;
