(function(undefined) {
    var actionType = "navigate",
        gaffa = window.gaffa;

    window.gaffa.actions[actionType] = function(action){
        var url;
        if(action.bindings.url.value.isArray && action.bindings.url.format){
            url = action.bindings.url.format.format(action.bindings.url.value);
        }else if(typeof action.bindings.url.value === "string"){
            url = action.bindings.url.value
        }else{
            url = action.bindings.url.value[0]
        }
       gaffa.navigate(url, action.bindings.model.value, action.bindings.post.value);
    };
})();