//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "concat";
    window.gaffa.actions[actionType] = function(action){
        var target = window.gaffa.model.get(action.bindings.target.binding),
            source = window.gaffa.model.get(action.bindings.source.binding);
        if(target.isArray){ 
            if(!(action.bindings.clone && action.bindings.clone.value === false)){
                source.fastEach(function(item, index){
                    source[index] = gaffa.clone(item);
                });
            }        
            window.gaffa.model.set(action.bindings.target.binding, action.bindings.target.value.concat(source)); 
        }
    };
})();