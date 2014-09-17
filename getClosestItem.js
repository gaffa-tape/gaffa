function getClosestItem(target){
    var iuid = target.iuid;

    while(!iuid && target){
        target = target.parentNode;

        if(target){
            iuid = target.iuid;
        }
    }

    return require('./bindable').getByIuid(iuid);
}

module.exports = getClosestItem;