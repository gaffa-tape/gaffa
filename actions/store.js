//    Properties:
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
})();