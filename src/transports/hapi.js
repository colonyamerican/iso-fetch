import _ from 'lodash';
import Promise from 'bluebird';
import boom from 'boom';

function parseResponse(payload) {
  let response;

  try {
    response = JSON.parse(payload);
    response = response.payload ? response.payload : response;
  } catch (e) {
    if (e instanceof SyntaxError) {
      response = payload;
    } else {
      throw e;
    }
  }

  return response;
}

export default (config, opts) => {
  const request = config.request;

  if (! request) {
    throw new Error('FluxappFetch:hapi requires a request option be set');
  }

  return new Promise((resolve, reject) => {
    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      return reject(new Error('FluxappFetch:hapi Request options must be a non-empty object'));
    }

    opts.headers = _.assign({
      Cookie : request.headers.cookie,
    }, opts.headers || {});

    request.server.inject(opts, (res) => {
      const result = res.result;
      const statusCode = result && result.statusCode || res.statusCode;

      if (statusCode >= 400) {
        const error = new Error();
        reject(boom.wrap(error, statusCode, result.message));
      } else {
        resolve({
          statusCode : statusCode,
          result : parseResponse(res.payload),
          headers : res.headers,
        });
      }
    });
  }).bind({}).then(function cleanUp(result) {
    _.assign(this, result);
    return result.result;
  });
};
