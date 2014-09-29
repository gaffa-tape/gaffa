var initialiseViewItem = require('./initialiseViewItem');

function initialiseView(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa._constructors.views, references);
}

module.exports = initialiseView;