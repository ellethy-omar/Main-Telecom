const router = require('express').Router();
const {
    handle3CXWebhook
} = require('../controllers/3cxWebHook');

// * 3CX Webhook endpoint (no authentication required)
router.post('/webhook/3cx', handle3CXWebhook);

// Extract req user since I know 3cx won't have the JWT.
const { findReqUser }= require('../../shared/letMeIn')
router.use(findReqUser);

// ! rest of routes are protected
const crudRoutes = require('./crudRoutes');
router.use('/crud', crudRoutes);

const analyticsRoutes = require('./analyticsRoutes');

router.use('/analytics', analyticsRoutes);

const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Calls Service'));

module.exports = router; 