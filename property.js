var createSpec = require('spec-js'),
    Bindable = require('./bindable'),
    IdentifierToken = require('gel-js').IdentifierToken,
    jsonConverter = require('./jsonConverter'),
    createModelScope = require('./createModelScope'),
    WhatChanged = require('what-changed'),
    merge = require('./flatMerge'),
    animationFrame = require('./raf.js'),
    requestAnimationFrame = animationFrame.requestAnimationFrame,
    cancelAnimationFrame = animationFrame.cancelAnimationFrame,
    resolvePath = require('./resolvePath'),
    excludeProps = require('./excludeProps');

var nextFrame;

function callPropertyUpdate(property){
    if(property._bound){
        property.update(property.parent, property.value);
    }
    property._queuedForUpdate = false;
}

function updateFrame() {
    while(nextFrame.length){
        callPropertyUpdate(nextFrame.pop());
    }
    nextFrame = null;
}

function requestUpdate(property){
    if(property._immediate){
        callPropertyUpdate(property);
        return;
    }

    if(!nextFrame){
        nextFrame = [];
        requestAnimationFrame(updateFrame);
    }


    if(!property._queuedForUpdate){
        nextFrame.push(property);
        property._queuedForUpdate = true;
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

function updateProperty(property, firstUpdate){
    // Update immediately, reduces reflows,
    // as things like classes are added before
    //  the element is inserted into the DOM
    if(firstUpdate){
        property.update(property.parent, property.value);
        property.hasChanged();
        return;
    }

    if(!property._bound){
        return;
    }

    if(property.hasChanged()){
        requestUpdate(property);
    }
}

function createPropertyCallback(property){
    return function (event) {

        var value,
            scope = createModelScope(property.parent, event),
            valueTokens;

        if(typeof event === 'boolean'){ // Non-model update.

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

        // Call the properties update function, if it has one.
        if(!property.update){
            return;
        }

        updateProperty(property, event === true);
    };
}

function inflateProperty(property, propertyDescription){
    var keys = Object.keys(propertyDescription),
        isProperty = propertyDescription instanceof Property;

    for(var i = 0; i < keys.length; i++){
        var key = keys[i];

        if(
            isProperty && (
                ~propertyDescription.__serialiseExclude__.indexOf(key) ||
                ~excludeProps.indexOf(key)
            )
        ){
            continue;
        }
        property[key] = propertyDescription[key];
    }
}

function Property(propertyDescription){
    if(!propertyDescription){
        return this;
    }

    if(typeof propertyDescription === 'function'){
        this.update = propertyDescription;
    }else{
        inflateProperty(this, propertyDescription);
    }

    this.on('bind', function(parent, scope) {
        this._lastValue = new WhatChanged(this.value, this.watchChanges);

        // Shortcut for properties that have no binding.
        // This has a significant impact on performance.
        if(this.binding == null){
            if(this.update){
                this.update(parent, this.value);
            }
            return;
        }

        var propertyCallback = createPropertyCallback(this),
            parentPath = resolvePath(parent);

        this._currentBinding = [this.binding, propertyCallback, parentPath];
        this.gaffa.gedi.bind(this.binding, propertyCallback, parentPath);
        propertyCallback(true, scope);

        if(this.interval){
            function intervalUpdate(){
                if(!property._bound){
                    return true;
                }
                propertyCallback(false, property.scope);
            }
            var property = this;
            if(!isNaN(this.interval)){
                function timeoutUpdate(){
                    if(!intervalUpdate()){
                        setTimeout(timeoutUpdate,property.interval);
                    }
                };
                timeoutUpdate();
            }else if(this.interval === 'frame'){
                function frameUpdate(){
                    if(!intervalUpdate()){
                        requestAnimationFrame(frameUpdate);
                    }
                };
                frameUpdate();
            }
        }
    });

    this.on('debind', function(){
        if(this._currentBinding){
            this.gaffa.gedi.debind.apply(this.gaffa.gedi, this._currentBinding);
            this._currentBinding = null;
        }
    });

    this.on('destroy', function(){
        this._lastValue = null;
    });

}
Property = createSpec(Property, Bindable);
Property.prototype.watchChanges = 'value keys structure reference type';
Property.prototype.hasChanged = function(){
    return Object.keys(this._lastValue.update(this.value)).length > 0;
};
Property.prototype.set = function(value, isDirty, scope){
    if(!this._bound){
        this.value = value;
        return;
    }

    scope = merge(this.scope, scope);

    var gaffa = this.gaffa,
        dirty = isDirty;

    if(this.cleans != null){
        dirty = (this.cleans === 'string' ? gaffa.model.get(this.cleans, this) :  this.cleans) === false ;
    }

    if(this.binding){
        var setValue = this.setTransform ? gaffa.model.get(this.setTransform, this, merge(this.scope, {value: value})) : value;
        gaffa.model.set(
            this.binding,
            setValue,
            this,
            dirty,
            scope
        );
    }else{
        this.value = value;
        if(this.update && this.parent._bound){
            this.update(this.parent, value);
        }
    }

};
Property.prototype.get = function(scope, asTokens){
    if(!this._bound){
        return this.value;
    }

    scope = merge(this.scope, scope);

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
Property.prototype.__serialiseExclude__ = ['_lastValue'];

module.exports = Property;