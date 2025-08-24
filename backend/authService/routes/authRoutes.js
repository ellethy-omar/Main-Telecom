const router = require('express').Router();
const {
    login,
    register,
    verifyToken
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);

router.get('/verifyToken', verifyToken);

const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Auth Service'));

module.exports = router;