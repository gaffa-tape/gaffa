(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "push";
    
    function Push(){}
    Push = gaffa.createSpec(Push, gaffa.Action);
    Push.prototype.type = actionType;
    Push.prototype.trigger = function(){
        var toObject = this.target.value;
        if(toObject === undefined || toObject === null){
            toObject = [];
            gaffa.model.set(this.target.binding, toObject, this);
        }
        if(Array.isArray(toObject)){
            var fromObj = this.source.value;
            if(!(this.clone && this.clone.value === false)){
                fromObj = gaffa.clone(fromObj);
            }
            pushToBinding = this.getPath().append(this.target.binding, gaffa.relativePath + gaffa.pathSeparator + toObject.length);
            gaffa.model.set(pushToBinding, fromObj, this);            
        } 
    };
    Push.prototype.target = new gaffa.Property();
    Push.prototype.source = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Push;
})();