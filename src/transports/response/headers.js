import _ from 'lodash';

const INVALID_CHARACTER = /[^a-z0-9\-#$%&'*+.\^_`|~]/i;

export default class Headers {
  constructor(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach((value, name) => {
        this.append(name, value);
      });
    } else if (_.isArray(headers)) {
      headers.forEach((header) => {
        this.append(header[0], header[1]);
      });
    } else if (headers) {
      _.each(headers, (value, key) => {
        this.append(key, value);
      });
    }
  }

  _normalizeName(name) {
    name = _.toString(name);

    if (INVALID_CHARACTER.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }

    return _.toLower(name);
  }

  append(name, value) {
    name = this._normalizeName(name);
    value = _.toString(value);
    const current = this.map[name];

    this.map[name] = current ? `${current}, ${value}` : value;
  }

  delete(name) {
    name = this._normalizeName(name);
    delete this.map[name];
  }

  get(name) {
    name = this._normalizeName(name);
    return _.get(this.map, name);
  }

  has(name) {
    name = this._normalizeName(name);

    return _.has(this.map, name);
  }

  set(name, value) {
    name = this._normalizeName(name);
    value = _.toString(value);
    this.map[name] = value;
  }

  forEach(cb, thisArg) {
    _.each(this.map, (value, name) => {
      cb.call(thisArg, value, name, this);
    });
  }

  keys() {
    return _.keys(this.map);
  }

  values() {
    return _.values(this.map);
  }

  entries() {
    return _.clone(this.map);
  }

  [Symbol.iterator]() {
    return {
      items : this.entries(),
      next() {
        return {
          done : this.items.length,
          value : this.items.shift(),
        };
      },
    };
  }
};
