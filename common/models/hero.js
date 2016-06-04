'use strict';

module.exports = function(Hero) {
  // Hero JSON patch (from heroesjson.com) remote method
  Hero.remoteMethod('patch', {
    description: 'Updates Hero collection from heroesjson.com/heroes.json',
    http: {verb: 'post', path: '/patch'},
  });

  var patch = require('../patch')(Hero);
  // Hero JSON patch (from  heroesjson.com) handler
  Hero.patch = patch('http://heroesjson.com/heroes.json', '.');
};
