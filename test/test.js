var mockery = require('mockery');

mockery.registerMock('gaffa', require('../'));

mockery.enable();

require('./json');