var initialiseViewItem = require('./initialiseViewItem');

function initialiseAction(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa._constructors.actions, references);
}

module.exports = initialiseAction;