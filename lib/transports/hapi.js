'use strict';
var Promise = require('bluebird');
var boom    = require('boom');
var R       = require('ramda');
var _       = require('lodash');

var options = {};
var cookie;

function parseResponse(payload) {
  var response;
  try {
    response = JSON.parse(payload);
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
function request(requestData) {
  return new Promise(function(resolve, reject) {
    if (! _.isPlainObject(requestData) || R.keys(requestData).length === 0) {
      return reject(new Error('Request data must be a non-empty object'));
    }

    requestData.headers = R.merge({
      Cookie: cookie
    }, requestData.headers || {});

    options.server.inject(requestData, function requestResponse(res) {
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

function init(opts, globalConfig) {
  options = opts;
  cookie = globalConfig.cookie;
}

module.exports = {
  request : request,
  init    : init
};
