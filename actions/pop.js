var Gaffa = require('gaffa'),
    actionType = "pop";

function Pop(){}
Pop = Gaffa.createSpec(Pop, Gaffa.Action);
Pop.prototype.type = actionType;
Pop.prototype.trigger = function(){

    if(this.source.value && this.source.value.pop){
        var popFrom = this.source.value,
            poppedValue = popFrom.pop();

        this.target.binding && this.target.set(poppedValue, this);
        this.source.set(popFromArray, this);
    }
};
Pop.prototype.target = new Gaffa.Property();
Pop.prototype.source = new Gaffa.Property();



module.exports = Pop;