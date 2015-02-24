iso-fetch
=========

An isomorphic API proxy, so far supporting hapijs and jquery transports.

## Protocol

Be advised that if your server response is a proper JSON with a `payload` key,
the value under `payload` will be taken as a response. This allows us to pass
additional metadata in the response.

## Usage

Assuming a standard jquery/hapijs setup, the usage is straightforward.
Setup is only required on the server, so that you need to provide `iso-fetch` with
a server instance to which it's going to inject requests:

    var server = new Hapi.Server();

    var api = require('iso-fetch');
    api.init({ hapi: { server: server } });

To use the API, either on the client or server, do

    var api = require('iso-fetch');
    api.request({ url: '/parachutes' }).then(function handle(replyData) { ...

Other properties of the request like `statusCode` or `headers` are bound to this
on the request `handle`r.

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

In order to force a transport for the current environment

    app.init({}, { current: 'jquery' });

Which will obviously result in an error if used on the server side. Be careful.


## Writing your own transports

Transports to other servers/clients are very welcome. A transport needs to export two
functions, `request` and `init`. Both accept a single `Object` and are used to post the
request and initialize the transport, respectively.

Remember that only the reply contents has to be passed down the promise chain
to the handler, the rest of the parameters (currently `statusCode` and `headers`)
are need to be bound to this.

When in doubt, consult the `hapi` and `jquery` transports.
