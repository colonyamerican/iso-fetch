'use strict';
var _ = require('lodash');
var transports = require('./transports');

module.exports = function getFetcher(name) {
  var fetcher = transports[name];
  var args = _.toArray(arguments).slice(1);

  if (args.length) {
    fetcher.bind(fetcher, args);
  }

  return {
    contextMethods: {
      fetch: fetcher;
    }
  };
};
