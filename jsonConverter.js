var deepEqual = require('deep-equal'),
    excludeProps = require('./excludeProps'),
    includeProps = require('./includeProps');

function processProperties(object, plainInstance, extraExclude, extraInclude, tempObject){
    Object.keys(object).forEach(function(key){
        var item = object[key];

        if(
            item !== undefined &&
            typeof item !== 'function' &&
            !deepEqual(plainInstance[key], item)
        ){
            tempObject[key] = item;
        }
    });

    includeProps.forEach(function(key){
        key in object && (tempObject[key] = object[key]);
    });

    extraInclude && extraInclude.forEach(function(key){
        key in object && (tempObject[key] = object[key]);
    });

    excludeProps.forEach(function(key){
        delete tempObject[key];
    });

    extraExclude && extraExclude.forEach(function(key){
        delete tempObject[key];
    });
}

function jsonConverter(object, extraExclude, extraInclude){
    var plainInstance = new object.constructor(),
        tempObject = (Array.isArray(object) || object instanceof Array) ? [] : {};

    processProperties(object, plainInstance, extraExclude, extraInclude, tempObject);

    if(!Object.keys(tempObject).length){
        return;
    }

    return tempObject;
}

module.exports = jsonConverter;