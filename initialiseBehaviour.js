var initialiseViewItem = require('./initialiseViewItem');

function initialiseBehaviour(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa._constructors.behaviours, references);
}

module.exports = initialiseBehaviour;