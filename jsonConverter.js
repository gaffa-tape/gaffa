var deepEqual = require('deep-equal'),
    excludeProps = require('./excludeProps'),
    includeProps = require('./includeProps');

function jsonConverter(object, exclude, include){
    var plainInstance = new object.constructor(),
        tempObject = (Array.isArray(object) || object instanceof Array) ? [] : {};

    //console.log(object.constructor.name);

    if(exclude){
        excludeProps = excludeProps.concat(exclude);
    }

    if(include){
        includeProps = includeProps.concat(include);
    }

    for(var key in object){
        if(typeof object[key] === 'function'){
            continue;
        }
        if(
            includeProps.indexOf(key)>=0 ||
            object.hasOwnProperty(key) &&
            excludeProps.indexOf(key)<0 &&
            !deepEqual(plainInstance[key], object[key])
        ){
            tempObject[key] = object[key];
        }
    }

    if(!Object.keys(tempObject).length){
        return;
    }

    return tempObject;
}

module.exports = jsonConverter;