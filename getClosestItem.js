function getClosestItem(target){
	if(!target){
		return;
	}
	
    var iuid = target.__iuid;

    while(!iuid && target){
        target = target.parentNode;

        if(target){
            iuid = target.__iuid;
        }
    }

    return require('./bindable').getByIuid(iuid);
}

module.exports = getClosestItem;