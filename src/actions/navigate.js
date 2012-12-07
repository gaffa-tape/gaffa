(function (undefined) {
    var actionType = "navigate";
    
    function Navigate(){}
    Navigate = gaffa.createSpec(Navigate, gaffa.Action);
    Navigate.prototype.type = actionType;
    Navigate.prototype.trigger = function(){
        trigger(this);
    };
    Navigate.prototype.url = new gaffa.Property();
    Navigate.prototype.model = new gaffa.Property();
    Navigate.prototype.post = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Navigate;
    
    function trigger(action) {
        gaffa.navigate(action.url.value, action.model.value, action.post.value);
    };
})();