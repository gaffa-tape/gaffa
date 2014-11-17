/**
    ## ContainerView

    A base constructor for gaffa Views that can hold child views.

    All Views that inherit from ContainerView will have:

        someView.views.content
*/

var createSpec = require('spec-js'),
    View = require('./view'),
    ViewContainer = require('./viewContainer'),
    Property = require('./property');

function ContainerView(viewDescription){
    this.views = this.views || {};
    this.views.content = new ViewContainer(this.views.content);
    this.on('bind', function(){
        for(var key in this.views){
            var viewContainer = this.views[key];

            if(viewContainer instanceof ViewContainer){
                viewContainer.bind(this);
            }
        }
    });
}
ContainerView = createSpec(ContainerView, View);
ContainerView.prototype.renderChildren = new Property({
    update: function(view, value){
        for(var key in view.views){
            view.views[key][value ? 'render' : 'derender']();
        }
    },
    value: true
});

module.exports = ContainerView;