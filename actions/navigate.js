(function (undefined) {
    var actionType = "navigate";
    
    function Navigate(){}
    Navigate = gaffa.createSpec(Navigate, gaffa.Action);
    Navigate.prototype.type = actionType;
    Navigate.prototype.url = new gaffa.Property();
    Navigate.prototype.model = new gaffa.Property();
    Navigate.prototype.post = new gaffa.Property();
    Navigate.prototype.external = new gaffa.Property();
    
    window.gaffa.actions[actionType] = Navigate;
    
    Navigate.prototype.trigger = function() {
        this.__super__.trigger.apply(this, arguments);

        if(this.external.value){
            window.location = this.url.value;
            return;
        }
        gaffa.navigate(this.url.value, this.model.value, this.post.value);
    }
})();