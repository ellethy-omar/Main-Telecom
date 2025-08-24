const router = require('express').Router();
const {
    getAgentStats,
    getCallDurationTrend,
    getCallFrequencyByPhone,
    getDailyCallVolume,
    getHourlyCallDistribution,
    getSystemStats,
    getTopAgentsByVolume
} = require('../controllers/analyticsController');

router.get('/getAgentStats/:agentId', getAgentStats);
router.get('/getDailyCallVolume', getDailyCallVolume);
router.get('/getCallFrequencyByPhone', getCallFrequencyByPhone);
router.get('/getHourlyCallDistribution', getHourlyCallDistribution);
router.get('/getTopAgentsByVolume', getTopAgentsByVolume);
router.get('/getCallDurationTrend', getCallDurationTrend);
router.get('/getSystemStats', getSystemStats);

module.exports = router;