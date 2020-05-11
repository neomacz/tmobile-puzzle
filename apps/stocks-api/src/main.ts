const Hapi = require('@hapi/hapi');
const Wreck = require('@hapi/wreck');

const start = async function() {

  const server = new Hapi.server({
    port: 3333,
    host: 'localhost',
  });

  const search = async function (symbol, time) {

    const url = 'https://sandbox.iexapis.com/beta/stock/' + symbol + '/chart/' + time +
      '?token=Tpk_652e69691d94476d84a3ae96343e10be';

    const { res, payload } = await Wreck.get(url);
    console.log('Calling remote server, not using cache');
    return payload.toString();
  };

  const sumCache = server.cache({
    expiresIn: 300 * 1000,
    segment: 'customSegment',
    generateFunc: async (id) => {
      return await search(id.symbol, id.time);
    },
    generateTimeout: 2000
  });

  try {
    server.route({
      method: "*",
      path: '/{symbol}/{time}',
      handler: async function (request, h) {

        const { symbol, time } = request.params;
        const id = `${symbol}:${time}`;
        console.log('Receiving request ->' + id);

        return await sumCache.get({ id, symbol, time });
      }

    });
    await server.start();

    console.log(`Server started at:  ${server.info.uri}`);
  }
  catch(e) {
    console.log('Failed to load server');
  }
}

start();
