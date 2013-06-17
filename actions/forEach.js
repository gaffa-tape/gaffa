(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        throw "Gaffa must be compiled with browserify";
    }
}(this, function(){
    var Gaffa = require('gaffa'),
        actionType = "forEach";
    
    function ForEach(){}
    ForEach = Gaffa.createSpec(ForEach, Gaffa.Action);
    ForEach.prototype.type = actionType;
    ForEach.prototype.target = new Gaffa.Property({
        trackKeys:true
    });

    ForEach.prototype.trigger = function(parent, scope, event) {
        this.__super__.trigger.apply(this, arguments);

        var items = this.target.value;

        if(!items){
            return;
        }

        var keys = items.__gaffaKeys__;

        for(var i = 0; i < items.length; i++){
            var psudoParent = new EachPsudoParent();
            psudoParent.gaffa = this.gaffa;
            psudoParent.path = this.getPath();
            psudoParent.key = keys ? keys[i] : '' + i;

            var actions = JSON.parse(JSON.stringify(this.actions['forEach']));

            psudoParent.actions.all = actions;
            psudoParent = this.gaffa.initialiseViewItem(psudoParent, psudoParent.gaffa, psudoParent.actions.constructors);

            this.gaffa.actions.trigger(psudoParent.actions.all, psudoParent, scope, event);
        }

        this.key = null;
    };

    function EachPsudoParent(){}
    EachPsudoParent = Gaffa.createSpec(EachPsudoParent, Gaffa.Action);
    EachPsudoParent.prototype.type = 'eachPsudoParent';

    return ForEach;
    
}));