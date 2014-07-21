/**
    ## ContainerView

    A base constructor for gaffa Views that can hold child views.

    All Views that inherit from ContainerView will have:

        someView.views.content
*/

var createSpec = require('spec-js'),
    View = require('./view'),
    ViewContainer = require('./viewContainer');

function ContainerView(viewDescription){
    this.views = this.views || {};
    this.views.content = new ViewContainer(this.views.content);
}
ContainerView = createSpec(ContainerView, View);
ContainerView.prototype.bind = function(parent){
    View.prototype.bind.apply(this, arguments);
    for(var key in this.views){
        var viewContainer = this.views[key];

        if(viewContainer instanceof ViewContainer){
            viewContainer.bind(this);
        }
    }
};

module.exports = ContainerView;