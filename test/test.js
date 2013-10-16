var mockery = require('mockery');

mockery.registerMock('gaffa', require('../'));

mockery.enable();

GLOBAL.window = {};

require('./json');
require('./extend');