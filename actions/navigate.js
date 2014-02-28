var Gaffa = require('gaffa'),
    actionType = "navigate";

function Navigate(){}
Navigate = Gaffa.createSpec(Navigate, Gaffa.Action);
Navigate.prototype.type = actionType;
Navigate.prototype.url = new Gaffa.Property();
Navigate.prototype.target = new Gaffa.Property();
Navigate.prototype.data = new Gaffa.Property();
Navigate.prototype.pushstate = new Gaffa.Property();
Navigate.prototype.external = new Gaffa.Property();
Navigate.prototype.trigger = function() {

    if(this.external.value){
        window.location = this.url.value;
        return;
    }
    this.gaffa.navigate(this.url.value, this.target.value, this.pushstate.value, this.data.value);
}

module.exports = Navigate;