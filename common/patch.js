'use strict';

var request = require('request');
var shortid = require('shortid');
var path = require('path');
var fs = require('fs');

module.exports = function(Model) {
  return function(url, tmpDir) {
    return function(callback) {
      var filename = path.join(tmpDir, shortid.generate() + '.json');
      var stream = request
        .get(url)
        .on('error', function(err) {
          callback(err);
        })
        .pipe(fs.createWriteStream(filename));

      stream.on('finish', function() {
        var models = require(filename);
        for (var i = 0; i < models.length; i++) {
          var model = models[i];
          Model.upsert(model, function(err, upsertedModel) {
            if (err) return callback(err);
          });
        }
        fs.unlink(filename);
        callback(null);
      });
    };
  };
};
