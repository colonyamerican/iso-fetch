'use strict';

var _ = require('lodash');


var transports = require('./transports');

var config = {
  server : 'hapi',
  client : 'jquery'
};

function initTransports(init, transports) {
  config = _.assign(config, transports || {});

  _.forEach(init, function(opts, initWhat) {
    transports[config[initWhat]].init(opts);
  });
}

function request(options) {
  if (config.current) {
    return transports[config.current].request(options);
  } else {
    var env = typeof window === 'object' ? 'client' : 'server';
    return transports[config[env]].request(options);
  }
}


module.exports = {
  init    : initTransports,
  request : request
};
