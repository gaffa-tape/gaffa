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
})();