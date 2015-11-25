/* global FormData */
import Promise from 'bluebird';
import _ from 'lodash';
import boom from 'boom';
import $ from 'jquery';

/**
 * Make an api request
 *
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Promise}
 */
export default (config, opts) => {
  return new Promise((resolve, reject) => {
    // enabled options
    // method=type, url=url, headers=headers, payload=data

    if (! _.isPlainObject(opts) || _.keys(opts).length === 0) {
      reject(new Error('Options must be a non-empty object'));
    }

    const optionMap = {
      method : 'type',
      url : 'url',
      headers : 'headers',
      payload : 'data',
      xhrFields : 'xhrFields',
    };

    const jQueryOpts = _.reduce(opts, (options, optValue, optKey) => {
      if (optionMap[optKey] === null) {
        throw new Error(`The option ${optKey} is not accepted`);
      }

      options[optionMap[optKey]] = optValue;
      return options;
    }, {});

    if (jQueryOpts.data instanceof FormData) {
      jQueryOpts.processData = false;
      jQueryOpts.contentType = false;
    }

    return $.ajax(jQueryOpts)
    .done((data, textStatus, jqXHR) => {
      const splitHeaders = _.filter(jqXHR.getAllResponseHeaders().split('\n'), function(row) {
        return row.length > 0;
      });

      const headers = _.reduce(splitHeaders, function(hdrs, hdr) {
        const split = hdr.split(':');
        hdrs[split[0]] = $.trim(_.rest(split).join(':'));
        return hdrs;
      }, {});

      resolve({
        statusCode : jqXHR.status,
        result : data.payload || data,
        headers : headers,
      });
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      const message = jqXHR.responseJSON.message || errorThrown;
      const error = new Error();

      reject(boom.wrap(error, jqXHR.status, message));
    });
  }).bind({}).then(function cleanUp(result) {
    _.assign(this, result);
    return result.result;
  });
};
