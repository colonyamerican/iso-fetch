iso-fetch
=========

An isomorphic API proxy, so far supporting hapijs and jquery transports.
Requires browserify/webpack on the client.


## Usage

Assuming a standard jquery/hapijs setup, the usage is straightforward.
Setup is only required on the server, so that you need to provide `iso-fetch` with
a server instance to which it's going to inject requests:

    var server = new Hapi.Server();

    var api = require('iso-fetch');
    api.init({ hapi: { server: server } });

To use the API, either on the client or server, do

    var api = require('iso-fetch');
    api.request({ url: '/parachutes' }).then(...

Have fun!

### Setting different transports

You can set different transports in different contexts, as well force `iso-fetch` to
always use a given transport. The latter is probably not something you want to 
be doing, so only do it if you know what you want to achieve.

Second parameter of `.init` sets respective transports like

    var api = require('iso-fetch');
    api.init({}, {
      server: 'SLS',
      client: 'dragons'
    });

In order to force a transport for both the client and server sides use

    app.init({}, { current: 'jquery' });

Which will obviously result in an error if used on the server side. Be careful.


## Writing your own transports

Transports to other servers/clients are very welcome. A transport needs to export two
functions, `request` and `init`. Both accept a single `Object` and are used to post the
request and initialize the transport, respectively.
