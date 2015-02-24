var deepEqual = require('deep-equal'),
    excludeProps = require('./excludeProps'),
    includeProps = require('./includeProps');

function addProp(plainInstance, object, key, extraExclude, extraInclude){
    var item = object[key]
    if(typeof item === 'function'){
        return;
    }
    if(
        item !== undefined &&
        (includeProps && (key in includeProps)) ||
        (extraInclude && ~extraInclude.indexOf(key)) ||
        object.hasOwnProperty(key) &&
        (excludeProps ? !(key in excludeProps) : true) &&
        (extraExclude ? !~extraExclude.indexOf(key) : true) &&
        !deepEqual(plainInstance[key], item)
    ){
        return item;
    }
}

function jsonConverter(object, extraExclude, extraInclude){
    var plainInstance = new object.constructor(),
        tempObject = (Array.isArray(object) || object instanceof Array) ? [] : {};

    for(var key in object){
        var item = addProp(plainInstance, object, key, extraExclude, extraInclude);
        if(item !== undefined){
            tempObject[key] = item;
        }
    }

    if(!Object.keys(tempObject).length){
        return;
    }

    return tempObject;
}

module.exports = jsonConverter;