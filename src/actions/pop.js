(function(undefined) {
    var actionType = "pop",
		gaffa = window.gaffa;
		
    gaffa.actions[actionType] = function(action){
        if(action.bindings.popFrom.value && action.bindings.popFrom.value.pop){
			var popFromArray = action.bindings.popFrom.value;			
			gaffa.model.set(action.bindings.popTo.binding, popFromArray.pop());
			gaffa.model.set(action.bindings.popFrom.binding, popFromArray);
        }
    };
})();