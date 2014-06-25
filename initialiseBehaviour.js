var initialiseViewItem = require('./initialiseViewItem');

function initialiseBehaviour(viewItem, gaffa, references) {
    return initialiseViewItem(viewItem, gaffa, gaffa.behaviours._constructors, references);
}

module.exports = initialiseBehaviour;