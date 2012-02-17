(function(undefined) {
    var actionType = "update";
    window.gaffa.actions[actionType] = function(action) {
        var req;
        if (gaffa.utils.propExists(action, "bindings.setTo.binding")){
            req = gaffa.model.get(action.bindings.setFrom.binding);
        } else {
            req = action.bindings.setFrom.value;
        }
        if (action.location === "local") {
             localStorage.setItem(action.path, JSON.stringify(req));
        } else if (action.location === "server") {
            $.ajax({
                cache: false,
                type: 'put',
                url: action.path,
                data: req,
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    if(data){
                        window.gaffa.model.set(action.bindings.setTo.binding, data);
                    }                      
                },
                error: function (res) {
                    console.log("Fetch Action failed with Server Response: " + res.status);
                }
            });
        }
    };
})();