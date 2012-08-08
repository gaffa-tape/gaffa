(function(undefined) {
    var actionType = "navigate",
        gaffa = window.gaffa;

    window.gaffa.actions[actionType] = function(action){        
       gaffa.navigate(action.properties.url.value, action.properties.model.value, action.properties.post.value);
    };
})();