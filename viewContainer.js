var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    View = require('./view'),
    initialiseViewItem = require('./initialiseViewItem'),
    Consuela = require('consuela'),
    removeViews = require('./removeViews'),
    arrayProto = Array.prototype;

function ViewContainer(viewContainerDescription){
    Bindable.call(this);
    var viewContainer = this;

    this._deferredViews = [];

    if(viewContainerDescription instanceof Array){
        viewContainer.add(viewContainerDescription);
    }
}
ViewContainer = createSpec(ViewContainer, Array);
for(var key in Bindable.prototype){
    ViewContainer.prototype[key] = Bindable.prototype[key];
}
ViewContainer.prototype.constructor = ViewContainer;
ViewContainer.prototype.bind = function(parent){
    Bindable.prototype.bind.call(this);

    this.parent = parent;
    this.gaffa = parent.gaffa;

    parent.once('debind', this.debind.bind(this));
    parent.once('destroy', this.destroy.bind(this));

    for(var i = 0; i < this.length; i++){
        this.add(this[i], i);
    }

    return this;
};
ViewContainer.prototype.debind = function(){
    for (var i = 0; i < this.length; i++) {
        this[i].detach();
    }
    Bindable.prototype.debind.call(this);
};
ViewContainer.prototype.getPath = function(){
    return getItemPath(this);
};

/*
    ViewContainers handle their own array state.
    A View that is added to a ViewContainer will
    be automatically removed from its current
    container, if it has one.
*/
ViewContainer.prototype.add = function(view, insertIndex){
    // If passed an array
    if(Array.isArray(view)){
        // Clone the array so splicing can't cause issues
        var views = view.slice();
        for(var i = 0; i < view.length; i++){
            this.add(view[i]);
        }
        return this;
    }

    // Is already in the tree somewhere? remove it.
    if(view.parentContainer instanceof ViewContainer){
        view.parentContainer.splice(view.parentContainer.indexOf(view),1);
    }

    this.splice(insertIndex >= 0 ? insertIndex : this.length,0,view);

    view.parentContainer = this;

    if(this._bound){
        if(view._bound){
            view.debind();
        }
        if(!(view instanceof View)){
            view = this[this.indexOf(view)] = initialiseViewItem(view, this.gaffa, this.gaffa.views._constructors);
        }
        view.gaffa = this.gaffa;

        this.gaffa.namedViews[view.name] = view;

        if(!view.renderedElement){
            view.render();
            view.renderedElement.viewModel = view;
        }
        view.bind(this.parent, this.parent.scope);
        view.insert(this, insertIndex);
    }

    return view;
};

/*
    adds 5 (5 is arbitrary) views at a time to the target viewContainer,
    then queues up another add.
*/
function executeDeferredAdd(viewContainer){
    var currentOpperation = viewContainer._deferredViews.splice(0,5);

    if(!currentOpperation.length){
        return;
    }

    for (var i = 0; i < currentOpperation.length; i++) {
        viewContainer.add(currentOpperation[i][0], currentOpperation[i][1]);
    };
    requestAnimationFrame(function(time){
        executeDeferredAdd(viewContainer);
    });
}

/*
    Adds children to the view container over time, via RAF.
    Will only begin the render cycle if there are no _deferredViews,
    because if _deferredViews.length is > 0, the render loop will
    already be going.
*/
ViewContainer.prototype.deferredAdd = function(view, insertIndex){
    var viewContainer = this,
        shouldStart = !this._deferredViews.length;

    this._deferredViews.push([view, insertIndex]);

    if(shouldStart){
        requestAnimationFrame(function(){
            executeDeferredAdd(viewContainer);
        });
    }
};

ViewContainer.prototype.abortDeferredAdd = function(){
    this._deferredViews = [];
};
ViewContainer.prototype.remove = function(view){
    view.remove();
};
ViewContainer.prototype.empty = function(){
    removeViews(this);
};
ViewContainer.prototype.__serialiseExclude__ = ['element'];

module.exports = ViewContainer;