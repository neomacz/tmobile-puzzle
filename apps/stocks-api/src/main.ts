const Hapi = require('@hapi/hapi');
const H2o2 = require('@hapi/h2o2');
const Catbox = require('@hapi/catbox');
const CatboxMemory = require('@hapi/catbox-memory');

const catboxClient = new Catbox.Client(CatboxMemory);

const start = async function() {

  const server = new Hapi.server({
    port: 3333,
    host: 'localhost',
  });

  try {
    await server.register(H2o2);
    server.route({
      method: "*",
      path: '/{symbol}/{time}',
      handler: {
        proxy: {
          uri: 'https://sandbox.iexapis.com/beta/stock/{symbol}/chart/{time}?token=Tpk_652e69691d94476d84a3ae96343e10be',
          passThrough: true
        }
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
