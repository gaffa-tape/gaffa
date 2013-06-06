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
        actionType = "browserStorage";
    
    function BrowserStorage(actionDefinition){
    }
    BrowserStorage = Gaffa.createSpec(BrowserStorage, Gaffa.Action);
    BrowserStorage.prototype.type = actionType;
    BrowserStorage.prototype.trigger = function(parent, scope, event){
        this.__super__.trigger.apply(this, arguments);

        var action = this,
            data = action.source.value;

        switch(action.method.value){
            case "get":
                action.target.set(JSON.parse(window[action.kind.value + 'Storage'].getItem(action.source.value)));
                break;

            case "set":
                JSON.parse(window[action.kind.value + 'Storage'].setItem(action.target.value, action.source.value));
                break;
        }
        
    };
    BrowserStorage.prototype.storageType = new Gaffa.Property({
        value: 'local'
    });
    BrowserStorage.prototype.method = new Gaffa.Property({
        value: 'get'
    });
    BrowserStorage.prototype.target = new Gaffa.Property();
    BrowserStorage.prototype.source = new Gaffa.Property();
    BrowserStorage.prototype.dirty = new Gaffa.Property();

    return BrowserStorage;

}));