// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/uploadPic',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8003/upload',
            changeOrigin: true,
        })
    );
};
