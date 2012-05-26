(function(undefined) {
    var actionType = "rest",
        handleData = function(modelBinding, data) {
        if (data) {
            if (data.behaviours || data.model || data.views) {
                if (data.behaviours) {
                    for (var i = 0; i < data.behaviours.length; i++) {
                        window.gaffa.behaviours.add(data.behaviours[i]);
                    }
                }
                if (data.model) {
                    window.gaffa.model.set(modelBinding, data.model);
                }
                if (data.views) {
                    for (var i = 0; i < data.views.length; i++) {
                        window.gaffa.views.add(data.views[i]);
                    }
                }
            } else {
                window.gaffa.model.set(modelBinding, data);
            }
        }
        window.gaffa.views.renderTarget = $("body");
        window.gaffa.views.render();
    }

    window.gaffa.actions[actionType] = function(action){
        if(action.location === "local"){
            if(window.gaffa.utils.propExists(action, "bindings.resource.binding")) {
                var data = JSON.parse(localStorage.getItem(action.path));
                handleData(action.bindings.setTo.binding, data);
            }
        } else if (action.location === "server") {
            if(window.gaffa.utils.propExists(action, "bindings.resource.binding")){
                $.ajax({
                    cache: false,
                    type: 'get',
                    url: action.path,
                    data: null,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data) {
                            handleData(action.bindings.resource.binding, data);
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