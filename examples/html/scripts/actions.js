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
        window.gaffa.views.renderTarget = $("body");
        window.gaffa.views.render();
    }

    window.gaffa.actions[actionType] = function(action){
        if(action.location === "local"){
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")) {
                var data = JSON.parse(localStorage.getItem(action.path));
                handleData(action.bindings.setTo.binding, data);
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
                        if (data) {
                            handleData(action.bindings.setTo.binding, data);
                        }                      
                    },
                    error: function (error) {
                        console.log("Fetch Action failed with Server Response: " + error.status);
                    }
                });
            }
        }
    };
})();(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();(function(undefined) {
    var actionType = "push";
    window.gaffa.actions[actionType] = function(action){
        var toObject = window.gaffa.model.get(action.bindings.pushTo.binding);
        if(toObject.isArray){
            if(window.gaffa.utils.propExists(action, "bindings.pushFrom.binding")){            
                window.gaffa.model.set(action.bindings.pushTo.binding + window.gaffa.pathSeparator() + toObject.length, window.gaffa.model.get(action.bindings.pushFrom.binding));                
            }else{
                window.gaffa.model.set(action.bindings.pushTo.binding + window.gaffa.pathSeparator() + toObject.length, action.bindings.pushFrom.value);            
            }
        }
    };
})();(function(undefined) {
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
})();(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(window.gaffa.utils.propExists(action, "bindings.setFrom.binding")){
			window.gaffa.model.set(action.bindings.setTo.binding, window.gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            window.gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();(function(undefined) {
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
})();(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();