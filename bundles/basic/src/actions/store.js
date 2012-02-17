(function(undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
                localStorage.setItem(action.storageKey, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
            }else{
                localStorage.setItem(action.storageKey, JSON.stringify(action.bindings.setFrom.value));            
            }
        } else if (action.location === "server") {
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")){
                $.ajax({
                    cache: false,
                    type: 'get',
                    url: action.path,
                    data: null,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        if(data){
                            window.gaffa.model.set(action.bindings.setTo.binding, data);
                        }                      
                    },
                    error: function (error) {
                        console.log("Fetch Action failed with Server Response: " + error.status);
                    }
                });
            }
        }
    };
})();