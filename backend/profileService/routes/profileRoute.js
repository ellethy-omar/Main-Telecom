const router = require('express').Router();
const {
    getAgentProfile,
    updateAgentProfile
} = require('../controllers/profileController');

router.get('/getAgentProfile', getAgentProfile);

router.put('/updateAgentProfile', updateAgentProfile);


const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Profile Service'));

module.exports = router;