const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:19105';

const context =  [
    "/api",
    "/hubs"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
      secure: false,
      ws: true
  });

  app.use(appProxy);
};
