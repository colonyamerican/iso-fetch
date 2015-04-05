'use strict';

var R = require('ramda');
var _ = require('lodash');

function IsoFetch(initData, options) {
  this.config = R.merge({
    server: 'hapi',
    client: 'jquery',
    cookie: undefined
  }, options || {});

  this.transports = require('./transports');

  _.forEach(initData, function(opts, transportName) {
    this.transports[transportName].init(opts, this.config);
  }, this);
}

IsoFetch.prototype.request = function request(requestData) {
  if (this.config.current) {
    return this.transports[this.config.current].request(requestData);
  } else {
    var env = typeof window === 'object' ? 'client' : 'server';
    return this.transports[this.config[env]].request(requestData);
  }
}

module.exports = IsoFetch;
