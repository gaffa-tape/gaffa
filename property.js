var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    IdentifierToken = require('gel-js').IdentifierToken,
    jsonConverter = require('./jsonConverter'),
    createModelScope = require('./createModelScope'),
    Consuela = require('consuela'),
    WhatChanged = require('what-changed');

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

    // Still run the _lastValue.update(),
    // because it sets up the state of the last value,
    // and it will be false anyway.

    if(property.hasChanged() && !property.nextUpdate){
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

                if(property.ignoreTargets && event.target.match(property.ignoreTargets)){
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


function Property(propertyDescription){
    if(typeof propertyDescription === 'function'){
        this.update = propertyDescription;
    }else{
        for(var key in propertyDescription){
            this[key] = propertyDescription[key];
        }
    }

    this._lastValue = new WhatChanged();
}
Property = createSpec(Property, Bindable);
Property.prototype.watchChanges = 'value keys structure reference type';
Property.prototype.hasChanged = function(){
    var changes = this._lastValue.update(this.value),
        watched = this.watchChanges.split(' ');

    for(var i = 0; i < watched.length; i++){
        if(changes[watched[i]]){
            return true;
        }
    }
};
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
        if(this.update && this.parent._bound){
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
Property.prototype.bind = bindProperty;
Property.prototype.debind = function(){
    cancelAnimationFrame(this.nextUpdate);
    this.gaffa && this.gaffa.model.debind(this);
    Bindable.prototype.debind.call(this);
};
Property.prototype.__serialiseExclude__ = ['_lastValue'];

module.exports = Property;