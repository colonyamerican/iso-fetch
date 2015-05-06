'use strict';
var transports = require('./transports');
var _ = require('lodash');

module.exports = function getFetcher(name, options) {
  var fetcher = transports[name].bind(fetcher, options);

  options = options || {};

  return function formater(opts) {
    if (_.isString(opts)) {
      opts = {
        url: opts
      };
    }
    
    return fetcher(opts);
  };
};
