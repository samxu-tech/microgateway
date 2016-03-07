'use strict'

var Promise = require('bluebird');
var express = require('express');
var app = express();
var ah = require('auth-header');

app.get('/auth', function(req, resp) {
  var results = ah.parse(req.get('authorization')).values;
  var auth = results.length === 1 ? results[0] : null;
  if (auth && auth.scheme == 'Basic') {
    var t = (new Buffer(auth.token, 'base64')).toString('utf-8');
    var user = t.split(':');
    if (user[0] === 'root' && user[1] === 'Hunter2') {
      resp.sendStatus(200);
    } else {
      resp.sendStatus(401);
    }
  } else {
    resp.sendStatus(401);
  }
});

app.get('/*', function(req, resp) {
  resp.send(req.url);
});

app.post('/*', function(req, resp) {
  resp.writeHead(200, req.headers);
  req.pipe(resp);
});

app.put('/*', function(req, resp) {
  resp.writeHead(200, req.headers);
  req.pipe(resp);
});

var server;
exports.start = function(port) {
  return new Promise(function(resolve, reject) {
    server = app.listen(port, function() {
      console.log('echo-server listening on port %d', port);
      resolve();
    });
  });
};

exports.stop = function() {
  return new Promise(function(resolve, reject) {
    if (server) {
      server.close(function() {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

exports.app = app;

if (require.main === module) {
  exports.start(8889).
    then(function() {
      console.log('echo-server listening on port 8889');
    });
}
