//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fetch";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")){
                var fromStorage = JSON.parse(localStorage.getItem(action.storageKey));
                if(fromStorage){
                    window.gaffa.model.set(action.bindings.setTo.binding, fromStorage);      
                }
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
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
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(window.gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            window.gaffa.model.set(action.bindings.setTo.binding,window. gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            window.gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
                localStorage.setItem(action.storageKey, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
            }else{
                localStorage.setItem(action.storageKey, JSON.stringify(action.bindings.setFrom.value));            
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fetch";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")){
                var fromStorage = JSON.parse(localStorage.getItem(action.storageKey));
                if(fromStorage){
                    window.gaffa.model.set(action.bindings.setTo.binding, fromStorage);      
                }
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
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
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(window.gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            window.gaffa.model.set(action.bindings.setTo.binding,window. gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            window.gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
                localStorage.setItem(action.storageKey, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
            }else{
                localStorage.setItem(action.storageKey, JSON.stringify(action.bindings.setFrom.value));            
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fetch";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(window.gaffa.utils.propExists(action, "bindings.setTo.binding")){
                var fromStorage = JSON.parse(localStorage.getItem(action.storageKey));
                if(fromStorage){
                    window.gaffa.model.set(action.bindings.setTo.binding, fromStorage);      
                }
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "fromJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.parse(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
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
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "set";
    window.gaffa.actions[actionType] = function(action){
        if(window.gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            window.gaffa.model.set(action.bindings.setTo.binding,window. gaffa.model.get(action.bindings.setFrom.binding));            
        }else{
            window.gaffa.model.set(action.bindings.setTo.binding, action.bindings.setFrom.value);            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "store";
    window.gaffa.actions[actionType] = function(action){
        if(action.storeType === "localStorage"){
            if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
                localStorage.setItem(action.storageKey, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
            }else{
                localStorage.setItem(action.storageKey, JSON.stringify(action.bindings.setFrom.value));            
            }
        }
        //ToDo: ajax (server storage)
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toJson";
    window.gaffa.actions[actionType] = function(action){
        if(gaffa.utils.propExists(action, "bindings.setFrom.binding")){
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(gaffa.model.get(action.bindings.setFrom.binding)));            
        }else{
            gaffa.model.set(action.bindings.setTo.binding, JSON.stringify(action.bindings.setFrom.value));            
        }
    };
})();//    Properties:
//        styles: container | container-fluid | row | row-fluid | span* | offset*
(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.bindings.toggle.binding, !gaffa.model.get(action.bindings.toggle.binding));
    };
})();