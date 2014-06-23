var initialiseViewItem = require('./initialiseViewItem');

function initialiseView(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.views._constructors, references);
}

module.exports = initialiseView;