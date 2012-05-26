(function(undefined) {
    var actionType = "remove";
    window.gaffa.actions[actionType] = function(action){
		window.gaffa.model.remove(action.bindings.target.binding);
    };
})();