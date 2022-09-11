const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api-bilibili',
    createProxyMiddleware({
      target: 'https://member.bilibili.com',
      changeOrigin: true,
      pathRewrite: path => path.replace('/api-bilibili', ''),
      headers: {
        referer: 'https://member.bilibili.com',
        cookie: ``,
      },
    }),
  );
};
