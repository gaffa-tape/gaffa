var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    View = require('./view'),
    initialiseViewItem = require('./initialiseViewItem'),
    removeViews = require('./removeViews'),
    requestInsersion = require('./requestInsersion'),
    arrayProto = Array.prototype;

function ViewContainer(viewContainerDescription){
    Bindable.call(this);
    var viewContainer = this;

    this._deferredViews = [];

    if(viewContainerDescription instanceof ViewContainer){
        return viewContainerDescription._clone();
    }

    if(viewContainerDescription instanceof Array){
        viewContainer.add(viewContainerDescription);
    }

    this.on('bind', function(parent){
        for(var i = 0; i < this.length; i++){
            this.add(this[i], i);
        }

        return this;
    });
}
ViewContainer = createSpec(ViewContainer, Array);
for(var key in Bindable.prototype){
    ViewContainer.prototype[key] = Bindable.prototype[key];
}
ViewContainer.prototype.constructor = ViewContainer;
ViewContainer.prototype._render = true;
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
    if(view instanceof Array){
        // Clone the array so splicing can't cause issues
        var views = view.slice();
        for(var i = 0; i < view.length; i++){
            this.add(view[i]);
        }
        return this;
    }

    if(view.parentContainer !== this || this.indexOf(view) !== insertIndex){
        if(view.parentContainer instanceof ViewContainer){
            view.parentContainer.splice(view.parentContainer.indexOf(view),1);
        }

        this.splice(insertIndex >= 0 ? insertIndex : this.length,0,view);
        this.emit('inserted', view);
    }

    view.parentContainer = this;

    if(this._bound && this._render){
        if(!(view instanceof View)){
            view = this[this.indexOf(view)] = this.gaffa.initialiseView(view);
        }
        if(!view._bound){

            view.gaffa = this.parent.gaffa;

            if(!view.renderedElement){
                view.render();
                view.renderedElement.__iuid = view.__iuid;
                if(view.gaffa.debug && !(view.gaffa.browser.msie && view.gaffa.browser.version <9)){
                    view.renderedElement.viewModel = view;
                }
            }
            view.once('bind', function(){
                view.insert(view.parentContainer, insertIndex);
            });
            view.bind(this.parent, this.parent.scope);
        }else{
            view.insert(this, insertIndex);
        }
    }

    return view;
};

/*
    Adds children to the view container over time.
*/
ViewContainer.prototype.deferredAdd = function(view, insertIndex){
    this._deferredViews.push([view, insertIndex]);
    requestInsersion(this, this._deferredViews);
};

ViewContainer.prototype.abortDeferredAdd = function(){
    while(this._deferredViews.length){
        var view = this._deferredViews.pop()[0];
        if(view instanceof View && !view._bound){
            view.destroy();
        }
    }
};
ViewContainer.prototype.render = function(){
    this._render = true;
    for(var i = 0; i < this.length; i++){
        this.deferredAdd(this[i], i);
    }
};
ViewContainer.prototype.derender = function(){
    this._render = false;
    for(var i = 0; i < this.length; i++){
        var childView = this[i];

        if(childView._bound){
            childView.detach();
            childView.debind();
        }
    }
};
ViewContainer.prototype.remove = function(view){
    view.remove();
    this.emit('removed', view);
};
ViewContainer.prototype.empty = function(){
    removeViews(this);
    this.emit('empty');
};
ViewContainer.prototype.__serialiseExclude__ = ['element'];

module.exports = ViewContainer;