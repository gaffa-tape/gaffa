var ViewItem = require('./viewItem');

function initialiseViewItem(viewItem, gaffa, specCollection, references) {
    references = references || {
        objects: [],
        viewItems: []
    };

    // ToDo: Deprecate .type
    var viewItemType = viewItem._type || viewItem.type;

    if(!(viewItem instanceof ViewItem)){
        if (!specCollection[viewItemType]) {
            throw "No constructor is loaded to handle view of type " + viewItemType;
        }

        var referenceIndex = references.objects.indexOf(viewItem);
        if(referenceIndex >= 0){
            return references.viewItems[referenceIndex];
        }

        references.objects.push(viewItem);
        viewItem = new specCollection[viewItemType](viewItem);
        references.viewItems.push(viewItem);
    }

    for(var key in viewItem.views){
        if(!(viewItem.views[key] instanceof ViewContainer)){
            viewItem.views[key] = new ViewContainer(viewItem.views[key]);
        }
        var views = viewItem.views[key];
        for (var viewIndex = 0; viewIndex < views.length; viewIndex++) {
            var view = initialiseView(views[viewIndex], gaffa, references);
            views[viewIndex] = view;
            view.parentContainer = views;
        }
    }

    for(var key in viewItem.actions){
        var actions = viewItem.actions[key];
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
            var action = initialiseAction(actions[actionIndex], gaffa, references);
            actions[actionIndex] = action;
            action.parentContainer = actions;
        }
    }

    if(viewItem.behaviours){
        for (var behaviourIndex = 0; behaviourIndex < viewItem.behaviours.length; behaviourIndex++) {
            var behaviour = initialiseBehaviour(viewItem.behaviours[behaviourIndex], gaffa, references);
            viewItem.behaviours[behaviourIndex] = behaviour;
            behaviour.parentContainer = viewItem.behaviours;
        }
    }

    return viewItem;
}

module.exports = initialiseViewItem;