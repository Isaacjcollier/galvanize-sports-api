var express = require('express');
var app = express();
var uuid = require('node-uuid');

// inventory and cart are attached to the global
// scope specifically for testing
global.inventory = require('./inventory');
global.carts = [];

app.use(require('body-parser').json());

// do not log with morgan when in test mode
if ( process.env.NODE_ENV !== 'test' ) {
  app.use(require('morgan')('dev'));
}


// your code here!

app.listen(3000);

module.exports = app;
