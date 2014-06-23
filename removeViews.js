function removeViews(views){
    if(!views){
        return;
    }

    views = views instanceof Array ? views : [views];

    views = views.slice();

    for(var i = 0; i < views.length; i++) {
        views[i].remove();
    }
}

module.exports = removeViews;