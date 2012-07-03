(function(undefined) {
    var actionType = "fetch",
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
        window.gaffa.views.render();
    }

    window.gaffa.actions[actionType] = function(action){
        if (action.location === "local") {
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")) {
                var localData = localStorage.getItem(action.source);
                if(localData === "undefined"){
                    handleData(action.bindings.setTo.binding, undefined);                
                }else{
                    handleData(action.bindings.setTo.binding, JSON.parse(localData));
                }
            }
        } else if (action.location === "server") {

            if (action.useCache && action.bindings.target.value) {
                return;
            }else{
                if (window.gaffa.utils.propExists(action, "bindings.source.binding")) {
                    $.ajax({
                        cache: false,
                        type: 'get',
                        url: action.bindings.source.value, //binding,
                        data: action.bindings.data.value, // && gaffa.model.get(action.bindings.data.binding) || null,
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            if (data) {
                                handleData(action.bindings.target.binding, data);
                            }
                        },
                        error: function (error) {
                            console.log("Fetch Action failed with Server Response: " + error.status);
                        }
                    });
                }
            }
        }
    };
})();