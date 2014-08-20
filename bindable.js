var createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    Consuela = require('consuela'),
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
        referencePath,
        referenceItem = item;

    while(referenceItem){

        // item.path should be a child ref after item.sourcePath
        if(referenceItem.path != null){
            paths.push(referenceItem.path);
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
    var consuela = new Consuela();
    this.consuela = consuela;

    // instance unique ID
    this.__iuid = iuid++;
}
Bindable = createSpec(Bindable, EventEmitter);
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
Bindable.prototype.bind = function(parent){
    var bindable = this;

    if(parent && !parent._bound){
        console.warn('Attempted to bind to a parent who was not bound.');
        return;
    }
    if(this._bound){
        this.debind();
        this.consuela.cleanup();
        console.warn('Attempted to bind an already bound item.');
    }

    this._bound = true;

    if(parent){
        var debind = function(){
                bindable.debind();
            };
            destroy = function(){
                bindable.destroy();
            };
        parent.on('debind', debind);
        this.on('debind', function(){
            eventually(function(){
                parent.removeListener('debind', debind);
            });
        });
        parent.on('destroy', destroy);
        this.on('destroy', function(){
            eventually(function(){
                parent.removeListener('destroy', destroy);
            });
        });
    }

    bindable.emit('bind');
    bindable.removeAllListeners('bind');
};
Bindable.prototype.debind = function(){
    var bindable = this;

    if(!this._bound){
        // ToDo: This happens with actions, resolve.
        return;
    }
    this._bound = false;

    this.emit('debind');
    this.removeAllListeners('debind');

    eventually(function(){
        if(this._bound){
            // The item was rebound
            return;
        }
        bindable.consuela.cleanup();
    });
};
Bindable.prototype.destroy = function(){
    var bindable = this;

    this._destroyed = true;

    if(this._bound){
        this.debind();
    }

    this.emit('destroy');
    this.removeAllListeners('destroy');

    // Let any children bound to 'destroy' do their thing before actually destroying this.
    eventually(function(){
        bindable.consuela.cleanup();
        bindable.gaffa = null;
        bindable.parent = null;
    });
};

module.exports = Bindable;