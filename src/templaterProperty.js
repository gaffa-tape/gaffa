var Gaffa = require('gaffa'),
    createSpec = require('spec-js');

function TemplaterProperty(){}
TemplaterProperty = createSpec(TemplaterProperty, Gaffa.Property);
TemplaterProperty.prototype.trackKeys = true;

function buildKeyMap(values, source){
    var map = {};

    for(var key in values){
        if(Array.isArray(values) && isNaN(key)){
            continue;
        }

        for(var sourceKey in source){
            if(sourceKey in map || Array.isArray(source) && isNaN(sourceKey)){
                continue;
            }
            if(values[key] === source[sourceKey]){
                map[sourceKey] = key;
            }
        }
    }
    return map;
}

TemplaterProperty.prototype.update =function (viewModel, value) {
    if(!this.template){
        return;
    }
    this._templateCache = this._templateCache || this.template && JSON.stringify(this.template);
    this._emptyTemplateCache = this._emptyTemplateCache || this.emptyTemplate && JSON.stringify(this.emptyTemplate);
    var gaffa = this.gaffa,
        paths = gaffa.gedi.paths,
        viewsName = this.viewsName,
        childViews = viewModel.views[viewsName],
        sourcePath = this._sourcePath || '[]',
        viewsToRemove = childViews.slice();
        
    if (value && typeof value === "object"){

        var newView,
            isEmpty = true,
            itemIndex = 0;

        // build key map

        var keyMap = buildKeyMap(value, gaffa.model.get(sourcePath, this));

        for(var i = 0; i < childViews.length; i++){

            var childSourcePathParts = paths.toParts(childViews[i].sourcePath),
                childSourceKey = childSourcePathParts && childSourcePathParts.pop();

            if(!(childSourceKey in keyMap)){
                if(childViews[i].containerName === viewsName){
                    childViews[i].remove();
                    i--;
                }
            }
        }

        for(var key in keyMap){
            isEmpty = false;
            var exists = false,
                valueKey = paths.append(sourcePath, paths.create(key));

            for(var i = 0; i < childViews.length; i++){
                var child = childViews[i];
                    
                if(child.sourcePath === valueKey){
                    exists = true;
                    break;
                }
            }

            if(!exists){
                newView = gaffa.initialiseViewItem(JSON.parse(this._templateCache), this.gaffa, this.gaffa.views.constructors);
                newView.sourcePath = valueKey;
                newView.containerName = viewsName;
                childViews.add(newView, itemIndex);
            }

            itemIndex++;
        }

        if(isEmpty && this._emptyTemplateCache){
            newView = gaffa.initialiseViewItem(JSON.parse(this._emptyTemplateCache), this.gaffa, this.gaffa.views.constructors);
            newView.containerName = viewsName;
            childViews.add(newView, itemIndex);
        }
    }
};

module.exports = TemplaterProperty;