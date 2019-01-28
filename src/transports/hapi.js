import _ from 'lodash';
import Promise from 'bluebird';
import Response from './response';
import qs from 'qs';

export default (config, opts) => {
  const request = config.request;

  if (! request) {
    throw new Error('FluxappFetch:hapi requires a request configuration be set');
  }

  return Promise.try(() => {
    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      return reject(new Error('FluxappFetch:hapi Request options must be a non-empty object'));
    }

    opts.headers = _.clone(request.headers);
    opts.credentials = request.auth.credentials;

    delete opts.headers['accept-encoding'];

    if (['get', 'head'].indexOf(opts.method) !== -1 && _.isPlainObject(opts.payload)) {
      const parsed = qs.stringify(opts.payload);
      opts.payload = null;
      opts.url = opts.url.indexOf('?') !== -1 ? opts.url + parsed : `${opts.url}?${parsed}`;
    }

    if (_.isFunction(config.onRequest)) {
      opts = config.onRequest(opts, request, config);
    } else if (_.isPlainObject(config.requestOptions)) {
      opts = {
        ...opts,
        ...config.requestOptions,
      };
    }

    return request.server.inject(opts)
    .then((res) => {
      return new Response(res.payload, {
        status : res.statusCode,
        headers : res.headers,
        url : opts.url,
      });
    });
  });
};
