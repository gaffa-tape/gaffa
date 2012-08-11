//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "concat";
    window.gaffa.actions[actionType] = function(action){
        var target = window.gaffa.model.get(action.properties.target.binding),
            source = window.gaffa.model.get(action.properties.source.binding);
        if(target.isArray){ 
            if(!(action.properties.clone && action.properties.clone.value === false)){
                source.fastEach(function(item, index){
                    source[index] = gaffa.clone(item);
                });
            }        
            window.gaffa.model.set(action.properties.target.binding, action.properties.target.value.concat(source), action); 
        }
    };
})();