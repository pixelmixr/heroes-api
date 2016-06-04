'use strict';

module.exports = function(Battleground) {
  // Battleground JSON patch (from heroesjson.com) remote method
  Battleground.remoteMethod('patch', {
    description: 'Updates Battleground collection \
      from Github.com/pixelmixr/heroes-data',
    http: {verb: 'post', path: '/patch'},
  });

  var patch = require('../patch')(Battleground);
  // Battleground JSON patch (from  heroesjson.com) handler
  Battleground.patch = patch('https://raw.githubusercontent.com/pixelmixr/heroes-data/master/battlegrounds.json', '.');
};
