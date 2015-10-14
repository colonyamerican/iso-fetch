'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */

exports['default'] = function (config, opts) {
  return new _bluebird2['default'](function (resolve, reject) {
    // enabled options
    // method=type, url=url, headers=headers, payload=data

    if (!_lodash2['default'].isPlainObject(opts) || _lodash2['default'].keys(opts).length === 0) {
      reject(new Error('Options must be a non-empty object'));
    }

    var optionMap = {
      method: 'type',
      url: 'url',
      headers: 'headers',
      payload: 'data',
      xhrFields: 'xhrFields'
    };

    var jQueryOpts = _lodash2['default'].reduce(opts, function (options, optValue, optKey) {
      if (optionMap[optKey] === null) {
        throw new Error('The option ' + optKey + ' is not accepted');
      }

      options[optionMap[optKey]] = optValue;
      return options;
    }, {});

    return _jquery2['default'].ajax(jQueryOpts).done(function (data, textStatus, jqXHR) {
      var splitHeaders = _lodash2['default'].filter(jqXHR.getAllResponseHeaders().split('\n'), function (row) {
        return row.length > 0;
      });

      var headers = _lodash2['default'].reduce(splitHeaders, function (hdrs, hdr) {
        var split = hdr.split(':');
        hdrs[split[0]] = _jquery2['default'].trim(_lodash2['default'].rest(split).join(':'));
        return hdrs;
      }, {});

      resolve({
        statusCode: jqXHR.status,
        result: data.payload || data,
        headers: headers
      });
    }).fail(function (jqXHR, textStatus, errorThrown) {
      var message = jqXHR.responseJSON.message || errorThrown;
      var error = new Error();

      reject(_boom2['default'].wrap(error, jqXHR.status, message));
    });
  }).bind({}).then(function cleanUp(result) {
    _lodash2['default'].assign(this, result);
    return result.result;
  });
};

module.exports = exports['default'];