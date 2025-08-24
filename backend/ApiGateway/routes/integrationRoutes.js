const { Router } = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { requireAuth, handleServiceUnaviable } = require('../middleware/requireAuth')

function integrationRouter({ servicesURLS, GateWaySecret, authHeaderTitle }) {
  const router = Router();

  router.use('/swagger', createProxyMiddleware({
    target: servicesURLS.docsServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/swagger': '',
                        // ? Remove '/api/swagger' from forwarded path
                         // ? that means that the swagger service sees '/'
                         // ? but if for example the url is /api/swagger/potatoes
                         // ? the swagger service will only see '/potatoes'
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use('/auth', createProxyMiddleware({
    target: servicesURLS.authServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  // 3CX webhook endpoint (no authentication required)
  router.use('/calls/webhook', createProxyMiddleware({
    target: servicesURLS.callsServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/calls/webhook': '/webhook',
    },
    onError: handleServiceUnaviable
  }));

  router.use(requireAuth);

  router.use('/contacts', createProxyMiddleware({
    target: servicesURLS.contactsServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/contacts': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use('/cloudinary', createProxyMiddleware({
    target: servicesURLS.cloudinaryServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/cloudinary': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use('/profile', createProxyMiddleware({
    target: servicesURLS.profileServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/profile': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use('/tickets', createProxyMiddleware({
    target: servicesURLS.ticketsServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/tickets': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use('/calls', createProxyMiddleware({
    target: servicesURLS.callsServiceURL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/calls': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader(authHeaderTitle, GateWaySecret);
    },
    onError: handleServiceUnaviable
  }));

  router.use((req, res) => {
    res.status(404).json({ error: 'Invalid Route!' });
  });

  return router;
}

module.exports = integrationRouter;
