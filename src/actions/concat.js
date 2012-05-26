//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "concat";
    window.gaffa.actions[actionType] = function(action){
        var toObject = window.gaffa.model.get(action.bindings.target.binding);
        if(toObject.isArray){  
			window.gaffa.model.set(action.bindings.target.binding, action.bindings.target.value.concat(action.bindings.source.value)); 
        }
    };
})();