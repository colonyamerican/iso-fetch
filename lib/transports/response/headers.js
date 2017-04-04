'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var INVALID_CHARACTER = /[^a-z0-9\-#$%&'*+.\^_`|~]/i;

var Headers = (function () {
  function Headers(headers) {
    var _this = this;

    _classCallCheck(this, Headers);

    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        _this.append(name, value);
      });
    } else if (_lodash2['default'].isArray(headers)) {
      headers.forEach(function (header) {
        _this.append(header[0], header[1]);
      });
    } else if (headers) {
      _lodash2['default'].each(headers, function (value, key) {
        _this.append(key, value);
      });
    }
  }

  _createClass(Headers, [{
    key: '_normalizeName',
    value: function _normalizeName(name) {
      name = _lodash2['default'].toString(name);

      if (INVALID_CHARACTER.test(name)) {
        throw new TypeError('Invalid character in header field name');
      }

      return _lodash2['default'].toLower(name);
    }
  }, {
    key: 'append',
    value: function append(name, value) {
      name = this._normalizeName(name);
      value = _lodash2['default'].toString(value);
      var current = this.map[name];

      this.map[name] = current ? current + ', ' + value : value;
    }
  }, {
    key: 'delete',
    value: function _delete(name) {
      name = this._normalizeName(name);
      delete this.map[name];
    }
  }, {
    key: 'get',
    value: function get(name) {
      name = this._normalizeName(name);
      return _lodash2['default'].get(this.map, name);
    }
  }, {
    key: 'has',
    value: function has(name) {
      name = this._normalizeName(name);

      return _lodash2['default'].has(this.map, name);
    }
  }, {
    key: 'set',
    value: function set(name, value) {
      name = this._normalizeName(name);
      value = _lodash2['default'].toString(value);
      this.map[name] = value;
    }
  }, {
    key: 'forEach',
    value: function forEach(cb, thisArg) {
      var _this2 = this;

      _lodash2['default'].each(this.map, function (value, name) {
        cb.call(thisArg, value, name, _this2);
      });
    }
  }, {
    key: 'keys',
    value: function keys() {
      return _lodash2['default'].keys(this.map);
    }
  }, {
    key: 'values',
    value: function values() {
      return _lodash2['default'].values(this.map);
    }
  }, {
    key: 'entries',
    value: function entries() {
      return _lodash2['default'].clone(this.map);
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return {
        items: this.entries(),
        next: function next() {
          return {
            done: this.items.length,
            value: this.items.shift()
          };
        }
      };
    }
  }]);

  return Headers;
})();

exports['default'] = Headers;
;
module.exports = exports['default'];