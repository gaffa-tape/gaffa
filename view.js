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
    Behaviour = require('./behaviour');

function insertFunction(selector, renderedElement, insertIndex){
    var target = ((typeof selector === "string") ? document.querySelectorAll(selector)[0] : selector),
        referenceSibling;

    if(target && target.childNodes){
        referenceSibling = target.childNodes[insertIndex];
    }
    if (referenceSibling){
        target.insertBefore(renderedElement, referenceSibling);
    }  else {
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

function bindViewEvent(view, eventName){
    return view.gaffa.events.on(eventName, view.renderedElement, function (event) {
        view.triggerActions(eventName, createEventedActionScope(view, event), event);
    });
}

function View(viewDescription){
    var view = this;

    view.behaviours = view.behaviours || [];
}
View = createSpec(View, ViewItem);

View.prototype.bind = function(parent){
    ViewItem.prototype.bind.apply(this, arguments);

    this._watch(this.renderedElement);

    for(var key in this.actions){
        var actions = this.actions[key],
            off;

        if(actions.__bound){
            continue;
        }

        actions.__bound = true;

        bindViewEvent(this, key);
    }

    this.triggerActions('load');

    for(var i = 0; i < this.behaviours.length; i++){
        this.behaviours[i].gaffa = this.gaffa;
        Behaviour.prototype.bind.call(this.behaviours[i], this);
        this.behaviours[i].bind(this);
    }
};

View.prototype.detach = function(){
    this.renderedElement && this.renderedElement.parentNode && this.renderedElement.parentNode.removeChild(this.renderedElement);
};

View.prototype.remove = function(){
    this.detach();
    View.__super__.prototype.remove.call(this);
}

View.prototype.debind = function () {
    for(var i = 0; i < this.behaviours.length; i++){
        this.behaviours[i].debind();
    }

    this.triggerActions('unload');

    for(var key in this.actions){
        this.actions[key].__bound = false;
    }
    delete this.renderedElement.viewModel;
    for(var key in this){
        if(crel.isNode(this[key])){
            delete this[key];
        }
    }
    View.__super__.prototype.debind.call(this);
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

    if(viewContainer.indexOf(view) !== insertIndex){
        viewContainer.splice(insertIndex, 1, view);
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