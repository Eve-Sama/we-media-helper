const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/bilibili',
    createProxyMiddleware({
      target: 'https://member.bilibili.com',
      changeOrigin: true,
      pathRewrite: path => path.replace('/bilibili', ''),
      headers: {
        referer: 'https://member.bilibili.com',
        cookie: `111`,
      },
    }),
  );
};
