function getItemPath(item){
    var path,
        pathParts = [],
        referencePath,
        referenceItem = item;
    

    while(referenceItem){

        if(referenceItem.path != null){
            referencePath = new item.gaffa.Path(referenceItem.path);
            for(var i = referencePath.length - 1; i >= 0; i--){
                pathParts.push(referencePath[i]);
            }
        }

        if(referenceItem.key != null){
            pathParts.push(referenceItem.key);
        }

        if(referenceItem.parent){
            referenceItem = referenceItem.parent;
            continue;
        }

        referenceItem = null;
    }
    
    return new item.gaffa.Path(pathParts.reverse());
}

module.exports = getItemPath;