var Gaffa = require('gaffa'),
    createSpec = require('spec-js');

function TemplaterProperty(){}
TemplaterProperty = createSpec(TemplaterProperty, Gaffa.Property);
TemplaterProperty.prototype.trackKeys = true;

TemplaterProperty.prototype.update =function (viewModel, value) {
    if(!this.template){
        return;
    }
    this._templateCache = this._templateCache || JSON.stringify(this.template);
    var gaffa = this.gaffa,
        viewsName = this.viewsName,
        childViews = viewModel.views[viewsName],
        sourceKeys = this._sourceKeys,
        viewsToRemove = childViews.slice();
        
    if (value && typeof value === "object"){

        var newView,
            isEmpty = true,
            itemIndex = 0;

        for(var i = 0; i < childViews.length; i++){

            var childSourceKey = childViews[i].sourceKey;
            if(sourceKeys ? sourceKeys.indexOf(childSourceKey)<0 : childSourceKey.slice(1,2) in value){
                if(childViews[i].containerName === viewsName){
                    childViews[i].remove();
                }
            }
        }

        for(var key in value){
            if(Array.isArray(value) && isNaN(key)){
                continue;
            }
            isEmpty = false;
            var item = value[key],
                exists = false,
                valueKey = sourceKeys ? sourceKeys[key] : gaffa.gedi.paths.create(key);

            for(var i = 0; i < childViews.length; i++){
                var child = childViews[i];
                    
                if(child.sourceKey === valueKey){
                    exists = true;
                    break;
                }
            }

            if(!exists){
                newView = gaffa.initialiseViewItem(JSON.parse(this._templateCache), this.gaffa, this.gaffa.views.constructors);
                newView.sourceKey = valueKey;
                newView.containerName = viewsName;
                childViews.add(newView, itemIndex);
            }

            itemIndex++;
        }
    }
};

module.exports = TemplaterProperty;