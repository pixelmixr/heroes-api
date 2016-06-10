'use strict';

var _ = require('lodash');
var https = require('https');
var http = require('http');
var sslConfig = require('./ssl-config');

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function(httpOnly) {
  if (httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if (!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  // start the web server
  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('Web server listening @ %s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API @ %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

// Passport configurators
var loobackPassport = require('loopback-component-passport');
var PassportConfigurator = loobackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
var secrets = require('../secrets.json');

var flash = require('express-flash');
app.use(flash());

// Attempt to load providers.json
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1);
}

app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
app.middleware('session:before', cookieParser(secrets.cookieSecret));
app.middleware('session', expressSession({
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

for (var setting in config) {
  var c = config[setting];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(setting, c);
}
