'use strict';
var transports = require('./transports');

module.exports = function getFetcher(name, options) {
  var fetcher = transports[name];

  options = options || {};

  return fetcher.bind(fetcher, options);
};
