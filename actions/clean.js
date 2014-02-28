var Gaffa = require('gaffa'),
    actionType = "clean";

function Clean(){}
Clean = Gaffa.createSpec(Clean, Gaffa.Action);
Clean.prototype.type = actionType;
Clean.prototype.trigger = function(){

    this.gaffa.model.setDirtyState(this.target.binding, false, this);

    // Trigger events if needed.
    if(this.triggerEvents.value){
        this.gaffa.gedi.trigger(this.gaffa.gedi.paths.resolve(this.getPath(), this.target.binding));
    }
};
Clean.prototype.target = new Gaffa.Property();
Clean.prototype.triggerEvents = new Gaffa.Property();

module.exports = Clean;