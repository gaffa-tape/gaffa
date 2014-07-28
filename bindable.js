var createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    Consuela = require('consuela'),
    jsonConverter = require('./jsonConverter'),
    nextTick = require('next-tick');

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
Bindable.prototype.bind = function(){
    if(this._bound){
        this.debind();
    }
    this._bound = true;
    this.emit('bind');
    this.removeAllListeners('bind');
};
Bindable.prototype.debind = function(){
    if(!this._bound){
        return;
    }
    this._bound = false;

    this.emit('debind');
    this.consuela.cleanup();
    this.removeAllListeners('debind');
};
Bindable.prototype.destroy = function(){
    var bindable = this;

    this.emit('destroy');
    // Let any children bound to 'destroy' do their thing before actually destroying this.
    nextTick(function(){
        bindable.consuela.cleanup();
        bindable.removeAllListeners('destroy');
    });
};

module.exports = Bindable;