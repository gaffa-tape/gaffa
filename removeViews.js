function removeViews(views){
    if(!views){
        return;
    }

    views = views.slice ? views.slice() : [views];

    for(var i = 0; i < views.length; i++) {
        views[i].remove();
    }
}

module.exports = removeViews;