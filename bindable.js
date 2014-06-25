var createSpec = require('spec-js'),
    EventEmitter = require('events').EventEmitter,
    Consuela = require('consuela'),
    jsonConverter = require('./jsonConverter');

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
    Consuela.init(this);

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
    this._bound = true;
};
Bindable.prototype.debind = function(){
    this._bound = false;
    this._cleanup();
};

module.exports = Bindable;