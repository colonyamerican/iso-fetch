'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _responseHeaders = require('./response/headers');

var _responseHeaders2 = _interopRequireDefault(_responseHeaders);

var Response = (function () {
  _createClass(Response, null, [{
    key: 'error',
    value: function error() {
      throw new Error('Not Implemented');
    }
  }, {
    key: 'redirect',
    value: function redirect() {
      throw new Error('Not Implemented');
    }
  }]);

  function Response(body) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Response);

    this.type = 'default';
    this.status = _lodash2['default'].get(options, 'status', 200);
    this.statusText = _lodash2['default'].get(options, 'statusText', _httpStatusCodes2['default'].getStatusText(this.status));
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new _responseHeaders2['default'](options.headers);
    this.url = options.url || '';
    this.body = body;
  }

  _createClass(Response, [{
    key: 'text',
    value: function text() {
      var _this = this;

      return _bluebird2['default']['try'](function () {
        return _lodash2['default'].isString(_this.body) ? _this.body : JSON.stringify(_this.body);
      });
    }
  }, {
    key: 'json',
    value: function json() {
      var _this2 = this;

      return _bluebird2['default']['try'](function () {
        return _lodash2['default'].isObject(_this2.body) ? _this2.body : JSON.parse(_this2.body);
      });
    }
  }, {
    key: 'blob',
    value: function blob() {
      throw new Error('Not Implemented');
    }
  }, {
    key: 'arrayBuffer',
    value: function arrayBuffer() {
      throw new Error('Not Implemented');
    }
  }, {
    key: 'formData',
    value: function formData() {
      throw new Error('Not Implemented');
    }
  }, {
    key: 'clone',
    value: function clone() {
      throw new Error('Not Implemented');
    }
  }]);

  return Response;
})();

exports['default'] = Response;
;
module.exports = exports['default'];