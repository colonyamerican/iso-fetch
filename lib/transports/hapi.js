'use strict';
var Promise = require('bluebird');
var boom    = require('boom');
var _       = require('lodash');

var server;

function parseResponse(payload) {
  var reponse;
  try {
    response = JSON.parse(res.payload);
    response = response.payload ? response.payload : response;
  } catch (e) {
    if (e instanceof SyntaxError) {
      response = res.payload;
    } else {
      throw e;
    }
  }

  return response;
}

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */
function request(opts) {
  return new Promise(function(resolve, reject) {
    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      return reject(new Error('Options must be a non-empty object'));
    }

    server.inject(opts, function requestResponse(res) {
      var result = res.result;
      var statusCode = result && result.statusCode || res.statusCode;

      if (statusCode >= 400) {
        var error = new Error();
        return reject(boom.wrap(error, statusCode, result.message));
      } else {
        return resolve({
          statusCode : statusCode,
          result     : parseResponse(res.payload),
          headers    : res.headers,
        });
      }
    });
  }).bind({}).then(function cleanUp(result) {
    _.assign(this, result);
    return result.result;
  });
};

function init(opts) {
  server = opts.server;
}

module.exports = {
  request : request,
  init    : init
};
