var createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    merge = require('./flatMerge'),
    jsonConverter = require('./jsonConverter');

var stack = [];
function eventually(fn){
    stack.push(fn);
    if(stack.length === 1){
        setTimeout(function(){
            while(stack.length){
                stack.pop()();
            }
        },100);
    }
}

function getItemPath(item){
    var gedi = item.gaffa.gedi,
        paths = [],
        referenceItem = item;

    while(referenceItem){

        // item.path should be a child ref after item.sourcePath
        if(referenceItem.path != null){
            paths.push(referenceItem.path);
            if(gedi.paths.isAbsolute(referenceItem.path)){
                break;
            }
        }

        // item.sourcePath is most root level path
        if(referenceItem.sourcePath != null){
            paths.push(gedi.paths.create(referenceItem.sourcePath));
        }

        referenceItem = referenceItem.parent;
    }

    return gedi.paths.resolve.apply(this, paths.reverse());
}

var iuid = 0;

function Bindable(){
    this.setMaxListeners(1000);
    // instance unique ID
    this.__iuid = iuid++;
}
Bindable = createSpec(Bindable, EventEmitter);
Bindable.bindables = {};
Bindable.getByIuid = function(id){
    return this.bindables[id];
};
Bindable.prototype.getPath = function(){
    return getItemPath(this);
};
Bindable.prototype.getDataAtPath = function(){
    if(!this.gaffa){
        return;
    }
    return this.gaffa.model.get(getItemPath(this));
};
Bindable.prototype.toJSON = function(){
    var tempObject = jsonConverter(this, this.__serialiseExclude__, this.__serialiseInclude__);

    return tempObject;
};

function setupCleanup(bindable, parent){
    var onDebind = bindable.debind.bind(bindable);
    parent.once('debind', onDebind);
    bindable.once('debind', function(){
        bindable.parent.removeListener('debind', onDebind);
    });

    var onDestroy = bindable.destroy.bind(bindable);
    parent.once('destroy', onDestroy);
    bindable.once('destroy', function(){
        bindable.parent.removeListener('destroy', onDestroy);
    });
}

Bindable.prototype.bind = function(parent, scope){
    if(scope){
        this.scope = merge(scope, this.scope);
    }

    if(parent && !parent._bound){
        console.warn('Attempted to bind to a parent who was not bound.');
        return;
    }
    if(this._bound){
        this.debind();
        console.warn('Attempted to bind an already bound item.');
    }

    if(parent){
        this.gaffa = parent.gaffa;
        this.parent = parent;
        this._parentId = parent.__iuid;

        setupCleanup(this, parent);
    }

    this.updatePath();

    if('path' in this && !this.path){
        this._invalidPath = true;
        return;
    }

    this._bound = true;
    Bindable.bindables[this.__iuid] = this;
    this.emit('bind', parent, scope);
};
Bindable.prototype.getSourcePath = function(){
    return this.gaffa.gedi.paths.resolve(this.parent && this.parent.getPath(), this.sourcePath);
};
Bindable.prototype.updatePath = function(){
    if(!this.pathBinding || this._pathBindingBound){
        return;
    }

    this._pathBindingBound = true;

    var bindable = this,
        absoluteSourcePath = this.getSourcePath(),
        lastPath = this.path,
        gaffa = this.gaffa;

    function setPath(valueTokens){
        var newPath;

        if(valueTokens){
            var valueToken = valueTokens[valueTokens.length - 1];
            newPath = valueToken.sourcePathInfo && valueToken.sourcePathInfo.path;
        }

        if(newPath === lastPath){
            return;
        }

        lastPath = newPath;


        if(!bindable._bound && !bindable._invalidPath){
            bindable.path = newPath;
            return;
        }

        bindable.debind();
        bindable.path = newPath;

        if(newPath == null){
            bindable._invalidPath = true;
            return;
        }

        bindable._invalidPath = false;
        bindable.bind(bindable.parent, bindable.scope);
    }

    setPath(gaffa.gedi.get(this.pathBinding, absoluteSourcePath, bindable.scope, true));

    function handlePathChange(event){
        setPath(gaffa.model.get(bindable.pathBinding, bindable, bindable.scope, true));
    }

    gaffa.gedi.bind(this.pathBinding, handlePathChange, absoluteSourcePath);
    this.on('destroy', function(){
        gaffa.gedi.debind(bindable.pathBinding, handlePathChange, absoluteSourcePath);
    });
};
Bindable.prototype.debind = function(){
    var bindable = this;

    if(!this._bound){
        // ToDo: This happens with actions, resolve.
        return;
    }

    this.emit('debind');

    this._bound = false;

    delete Bindable.bindables[this.__iuid];
};
Bindable.prototype.destroy = function(){
    var bindable = this;

    this._destroyed = true;

    if(this._bound){
        this.debind();
    }

    // Destroy bindables asynchonously.
    eventually(function(){

        bindable.emit('destroy');
        bindable.removeAllListeners();

        // Let any children bound to 'destroy' do their thing before actually destroying this.
        eventually(function(){
            bindable.gaffa = null;
            bindable.parent = null;
        });
    });
};

module.exports = Bindable;
