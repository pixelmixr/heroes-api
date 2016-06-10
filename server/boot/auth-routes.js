'use strict';

var path = require('path');

module.exports = function(app) {
  app.get('/login', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  });
  app.get('/auth/account', function(req, res, next) {
    res.send('success.');
  });
};
