'use strict';
var Promise = require('bluebird');
var _       = require('lodash');
var boom    = require('boom');
var $       = require('jquery');

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */
module.exports = function request(opts) {
  return new Promise(function(resolve, reject) {
    // enabled options
    // method=type, url=url, headers=headers, payload=data

    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      reject(new Error('Options must be a non-empty object'));
    }

    var optionMap = {
      method  : 'type',
      url     : 'url',
      headers : 'headers',
      payload : 'data'
    };

    var jQueryOpts = _.reduce(opts, function makeOpts (opts, optValue, optKey) {
      if (optionMap[optKey] == null) {
        throw new Error('The option ' + optKey + ' is not accepted');
      }

      opts[optionMap[optKey]] = optValue;
      return opts;
    }, {});

    return $.ajax(jQueryOpts)
    .done(function doneHandler (data, textStatus, jqXHR) {
      var splitHeaders = _.filter(jqXHR.getAllResponseHeaders().split('\n'), function(row) {
        return row.length > 0;
      });

      var headers = _.reduce(splitHeaders, function(hdrs, hdr) {
        var split = hdr.split(':');
        hdrs[split[0]] = $.trim(_.rest(split).join(':'));
        return hdrs;
      }, {});

      resolve({
        statusCode : jqXHR.status,
        result     : data.payload || data,
        headers    : headers
      });
    })
    .fail(function failHandler (jqXHR, textStatus, errorThrown) {
      var message = jqXHR.responseJSON.message || errorThrown;
      var error = new Error();

      reject(boom.wrap(error, jqXHR.status, message));
    });
  }).bind({}).then(function cleanUp(result) {
    _.assign(this, result);
    return result.result;
  });
};
