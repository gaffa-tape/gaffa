var initialiseViewItem = require('./initialiseViewItem');

function initialiseAction(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.actions._constructors, references);
}

module.exports = initialiseAction;