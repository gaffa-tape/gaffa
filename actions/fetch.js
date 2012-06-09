//    Properties:
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
})();