function createModelScope(parent, gediEvent){
    var possibleGroup = parent,
        groupKey,
        scope = {};

    while(possibleGroup && !groupKey){
        groupKey = possibleGroup.group;
        possibleGroup = possibleGroup.parent;
    }

    scope.viewItem = parent;
    scope.groupKey = groupKey;
    scope.modelTarget = gediEvent && gediEvent.target;

    return scope;
}
module.exports = createModelScope;