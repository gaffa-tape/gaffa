(function(undefined) {
    var actionType = "toggle";
    window.gaffa.actions[actionType] = function(action){
        gaffa.model.set(action.properties.toggle.binding, !gaffa.model.get(action.properties.toggle.binding), action);
    };
})();

(function (undefined) {
    var gaffa = window.gaffa,
        actionType = "toggle";
    
    function Toggle(){}
    Toggle = gaffa.createSpec(Toggle, gaffa.Action);
    Toggle.prototype.type = actionType;
    Toggle.prototype.trigger = function(){
        gaffa.model.set(this.target.binding, !this.target.value, this);
    };
    Toggle.prototype.target = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Toggle;
})();