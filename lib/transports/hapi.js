'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

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

module.exports = function hapiFetcher(config, opts) {
  var request = config.request;

  if (! request) {
    throw new Error('iso-fetch:hapi requires a request option be set');
  }

  return new Promise(function(resolve, reject) {
    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      return reject(new Error('Request options must be a non-empty object'));
    }

    request.server.inject(opts, function requestResponse(res) {
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
