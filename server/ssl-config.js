'use strict';

var path = require('path');
var fs = require('fs');
exports.privateKey = fs.readFileSync(path.join(__dirname, './privatekey.pem')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './certificate.pem')).toString();