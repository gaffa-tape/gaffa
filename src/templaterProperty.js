var Gaffa = require('gaffa'),
    createSpec = require('spec-js');

function TemplaterProperty(){}
TemplaterProperty = createSpec(TemplaterProperty, Gaffa.Property);
TemplaterProperty.prototype.trackKeys = true;

function findValueIn(value, source){
    var isArray = Array.isArray(source);
    for(var key in source){
        if(isArray && isNaN(key)){
            continue;
        }
        if(source[key] === value){
            return key;
        }
    }
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
        sourcePathInfo = this._sourcePathInfo,
        viewsToRemove = childViews.slice(),
        isEmpty = true;

    if (value && typeof value === "object" && sourcePathInfo){

        if(!sourcePathInfo || !sourcePathInfo.subPaths){
            sourcePathInfo.subPaths = new value.constructor();

            for(var key in value){
                if(Array.isArray(value) && isNaN(key)){
                    continue;
                }
                sourcePathInfo.subPaths[key] = paths.append(sourcePathInfo.path, paths.create(key));
            }
        }

        var newView,
            itemIndex = 0;

        for(var i = 0; i < childViews.length; i++){

            var childSourcePath = childViews[i].sourcePath;

            if(!findValueIn(childSourcePath, sourcePathInfo.subPaths)){
                if(childViews[i].containerName === viewsName){
                    childViews[i].remove();
                    i--;
                }
            }
        }

        for(var key in sourcePathInfo.subPaths){
            if(Array.isArray(sourcePathInfo.subPaths) && isNaN(key)){
                continue;
            }
            isEmpty = false;
            var exists = false,
                sourcePath = sourcePathInfo.subPaths[key];

            for(var i = 0; i < childViews.length; i++){
                var child = childViews[i];

                if(child.sourcePath === sourcePath){
                    exists = true;
                    break;
                }
            }

            if(!exists){
                newView = gaffa.initialiseViewItem(JSON.parse(this._templateCache), this.gaffa, this.gaffa.views.constructors);
                newView.sourcePath = sourcePath;
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

    if(isEmpty){
        for(var i = 0; i < childViews.length; i++){
            if(childViews[i].containerName === viewsName){
                childViews[i].remove();
                i--;
            }
        }
        if(this._emptyTemplateCache){
            newView = gaffa.initialiseViewItem(JSON.parse(this._emptyTemplateCache), this.gaffa, this.gaffa.views.constructors);
            newView.containerName = viewsName;
            childViews.add(newView, itemIndex);
        }
    }
};

module.exports = TemplaterProperty;