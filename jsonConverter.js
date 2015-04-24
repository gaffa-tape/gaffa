var deepEqual = require('deep-equal'),
    excludeProps = require('./excludeProps'),
    includeProps = require('./includeProps');


function processProperties(object, plainInstance, extraExclude, extraInclude, tempObject){

    function processProperty(key){
        var item = object[key];

        if(
            item !== undefined &&
            typeof item !== 'function' &&
            (includeProps && (key in includeProps)) ||
            (extraInclude && ~extraInclude.indexOf(key)) ||
            object.hasOwnProperty(key) &&
            (excludeProps ? !(key in excludeProps) : true) &&
            (extraExclude ? !~extraExclude.indexOf(key) : true) &&
            !deepEqual(plainInstance[key], item)
        ){
            tempObject[key] = item;
        }
    }

    for(var key in object){
        processProperty(key);
    }
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