import Promise from 'bluebird';
import _ from 'lodash';
import statusCodes from 'http-status-codes';

import Headers from './response/headers';

export default class Response {
  static error() {
    throw new Error('Not Implemented');
  }
  static redirect() {
    throw new Error('Not Implemented');
  }

  constructor(body, options = {}) {
    this.type = 'default';
    this.status = _.get(options, 'status', 200);
    this.statusText = _.get(options, 'statusText', statusCodes.getStatusText(this.status));
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this.body = body;
  }

  text() {
    return Promise.try(() => {
      return _.isString(this.body) ? this.body : JSON.stringify(this.body);
    });
  }

  json() {
    return Promise.try(() => {
      return _.isObject(this.body) ? this.body : JSON.parse(this.body);
    });
  }

  blob() {
    throw new Error('Not Implemented');
  }
  arrayBuffer() {
    throw new Error('Not Implemented');
  }
  formData() {
    throw new Error('Not Implemented');
  }

  clone() {
    throw new Error('Not Implemented');
  }
};
