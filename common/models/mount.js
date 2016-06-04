'use strict';

module.exports = function(Mount) {
  // Mount JSON patch (from heroesjson.com) remote method
  Mount.remoteMethod('patch', {
    description: 'Updates Mount collection from heroesjson.com/mounts.json',
    http: {verb: 'post', path: '/patch'},
  });

  var patch = require('../patch')(Mount);
  // Mount JSON patch (from  heroesjson.com) handler
  Mount.patch = patch('http://heroesjson.com/mounts.json', '.');
};
