var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    IdentifierToken = require('gel-js').IdentifierToken,
    jsonConverter = require('./jsonConverter'),
    createModelScope = require('./createModelScope'),
    Consuela = require('consuela');

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

function updateProperty(property, firstUpdate){
    // Update immediately, reduces reflows,
    // as things like classes are added before
    //  the element is inserted into the DOM
    if(firstUpdate){
        property.update(property.parent, property.value);
    }

    // Still run the sameAsPrevious function,
    // because it sets up the last value hash,
    // and it will be false anyway.
    if(!property.sameAsPrevious() && !property.nextUpdate){
        if(property.gaffa.debug){
            property.update(property.parent, property.value);
            return;
        }
        property.nextUpdate = requestAnimationFrame(function(){
            if(property.parent._bound){
                property.update(property.parent, property.value);
            }
            property.nextUpdate = null;
        });
    }
}

function createPropertyCallback(property){
    return function (event) {
        var value,
            scope,
            valueTokens;

        if(event){

            scope = createModelScope(property.parent, event);

            if(event === true){ // Initial update.

                valueTokens = property.get(scope, true);

            }else if(event.captureType === 'bubble' && property.ignoreBubbledEvents){

                return;

            }else if(property.binding){ // Model change update.

                if(property.ignoreTargets && event.target.toString().match(property.ignoreTargets)){
                    return;
                }

                valueTokens = property.get(scope, true);
            }

            if(valueTokens){
                var valueToken = valueTokens[valueTokens.length - 1];
                value = valueToken.result;
                property._sourcePathInfo = valueToken.sourcePathInfo;
            }

            property.value = value;
        }

        // Call the properties update function, if it has one.
        // Only call if the changed value is an object, or if it actually changed.
        if(!property.update){
            return;
        }

        updateProperty(property, event === true);
    }
}


function bindProperty(parent) {
    this.parent = parent;

    parent.on('debind', this.debind.bind(this));

    // Shortcut for properties that have no binding.
    // This has a significant impact on performance.
    if(this.binding == null){
        if(this.update){
            this.update(parent, this.value);
        }
        return;
    }

    var propertyCallback = createPropertyCallback(this);

    this.gaffa.model.bind(this.binding, propertyCallback, this);
    propertyCallback(true);
    Bindable.prototype.bind.call(this);
}

function createValueHash(value){
    if(value && typeof value === 'object'){
        return Object.keys(value);
    }

    return value;
}


function compareToHash(value, hash){
    if(value && hash && typeof value === 'object' && typeof hash === 'object'){
        var keys = Object.keys(value);
        if(keys.length !== hash.length){
            return;
        }
        for (var i = 0; i < hash.length; i++) {
            if(hash[i] !== keys[i]){
                return;
            }
        };
        return true;
    }

    return value === hash;
}


function Property(propertyDescription){
    if(typeof propertyDescription === 'function'){
        this.update = propertyDescription;
    }else{
        for(var key in propertyDescription){
            this[key] = propertyDescription[key];
        }
    }
}
Property = createSpec(Property, Bindable);
Property.prototype.set = function(value, isDirty){
    var gaffa = this.gaffa;

    if(this.binding){
        var setValue = this.setTransform ? gaffa.model.get(this.setTransform, this, {value: value}) : value;
        gaffa.model.set(
            this.binding,
            setValue,
            this,
            isDirty
        );
    }else{
        this.value = value;
        this._previousHash = createValueHash(value);
        if(this.update){
            this.update(this.parent, value);
        }
    }

};
Property.prototype.get = function(scope, asTokens){
    if(this.binding){
        var value = this.gaffa.model.get(this.binding, this, scope, asTokens);
        if(this.getTransform){
            scope.value = asTokens ? value[value.length-1].result : value;
            return this.gaffa.model.get(this.getTransform, this, scope, asTokens);
        }
        return value;
    }else{
        return this.value;
    }
};
Property.prototype.sameAsPrevious = function () {
    if(compareToHash(this.value, this._previousHash)){
        return true;
    }
    this._previousHash = createValueHash(this.value);
};
Property.prototype.setPreviousHash = function(hash){
    this._previousHash = hash;
};
Property.prototype.getPreviousHash = function(hash){
    return this._previousHash;
};
Property.prototype.bind = bindProperty;
Property.prototype.debind = function(){
    cancelAnimationFrame(this.nextUpdate);
    this.gaffa && this.gaffa.model.debind(this);
    Bindable.prototype.debind.call(this);
};
Property.prototype.__serialiseExclude__ = ['_previousHash'];

module.exports = Property;