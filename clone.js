var deepEqual = require('deep-equal'),
    sameValue = require('same-value'),
    flatMerge = require('flat-merge'),
    crel = require('crel');

module.exports = function clone(object, reference){
    var Bindable = require('./bindable'),
        objects = [],
        refs = [],
        magicKey = '__clone_key_' + Math.random();

    function innerClone(object, reference){
        if(!object || typeof object !== 'object'){
            return object;
        }

        var index = objects.indexOf(object);

        if(~index){
            refs[index][magicKey] = 'bar';
            return refs[index];
        }

        var copy = object._toPOJO ? object._toPOJO() : flatMerge(object),
            keys = Object.keys(copy),
            isBindiable = object instanceof Bindable,
            result = Array.isArray(copy) ? [] : {};

        objects.push(object);
        refs.push(result);
                
        if(!reference){
            if(~index){
                reference = new objects[index].constructor();
            }else{
                reference = new object.constructor();
            }
        }

        for(var i = 0; keys && i < keys.length; i++){
            var key = keys[i],
                item = copy[key],
                itemCopy;

            if (typeof item === 'function'){
                continue;
            }else if(!item || typeof item !== 'object'){
                itemCopy = item;
            }else{
                itemCopy = innerClone(item, reference[key]);
            }

            if(
                itemCopy === undefined || 
                (reference && itemCopy === reference[key]) || 
                (typeof itemCopy === 'object' && Object.keys(itemCopy).length === 0)
            ){
                continue;
            }

            if(itemCopy && itemCopy[magicKey]){
                delete itemCopy[magicKey];
            }

            result[key] = itemCopy
        }

        if(isBindiable && object._type || object.type){
            result._type = object._type || object.type;
        }

        return result;
    }

    return innerClone(object, reference);
};