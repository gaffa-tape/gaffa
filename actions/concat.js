var Gaffa = require('gaffa'),
    fastEach = require('fasteach'),
    actionType = "concat";

function Concat(){}
Concat = Gaffa.createSpec(Concat, Gaffa.Action);
Concat.prototype.type = actionType;
Concat.prototype.trigger = function(){

    var gaffa = this.gaffa,
        target = this.target.value,
        source = this.source.value


    if(source && source.slice){
        source = source.slice();
    }

    if(target && target.concat){
        if(Array.isArray(target) && !(this.clone && this.clone.value === false)){
            fastEach(source, function(item, index){
                source[index] = gaffa.clone(item);
            });
        }
        this.target.set(this.target.value.concat(source), this);
    }
};
Concat.prototype.target = new Gaffa.Property();
Concat.prototype.source = new Gaffa.Property();
Concat.prototype.clone = new Gaffa.Property();



module.exports = Concat;