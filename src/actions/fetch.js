(function(undefined) {
    var actionType = "fetch";
    
    function handleData(action, modelBinding, data) {
        if (data) {
            if (data.behaviours || data.model || data.views) {
                if (data.behaviours) {
                    for (var i = 0; i < data.behaviours.length; i++) {
                        window.gaffa.behaviours.add(data.behaviours[i]);
                    }
                }
                if (data.model) {
                    window.gaffa.model.set(modelBinding, data.model, action);
                }
                if (data.views) {
                    for (var i = 0; i < data.views.length; i++) {
                        window.gaffa.views.add(data.views[i]);
                    }
                }
            } else {
                window.gaffa.model.set(modelBinding, data, action);
            }
        }
        window.gaffa.views.render();
    }

    window.gaffa.actions[actionType] = function(action){
        if (action.location === "local") {
            if(window.gaffa.utils.propExists(action, "properties.target.binding")) {
                var localData = localStorage.getItem(action.properties.source.value);
                if(localData === "undefined"){
                    handleData(action, action.properties.target.binding, undefined);                
                }else{
                    handleData(action, action.properties.target.binding, JSON.parse(localData));
                }
            }
        } else if (action.location === "server") {

            if (action.useCache && action.properties.target.value) {
                return;
            }else{
                if (window.gaffa.utils.propExists(action, "properties.source.value")) {
                    $.ajax({
                        cache: false,
                        type: 'get',
                        url: action.properties.source.value,
                        data: action.properties.data.value,
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            if (data) {
                                handleData(action, action.properties.target.binding, data);
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