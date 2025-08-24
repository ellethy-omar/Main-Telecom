const {
    generateToken,
    verifyTokenMiddleware
} = require('../middleware/middleware');
const { logEndpointHit } = require('../../shared/logger');

const AuthService = require('../models/AuthService');

const login = async (req, res) => {
    logEndpointHit('login');
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await AuthService.login(email, password);
        
        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        const token = generateToken(result.agent.agentId);
        
        res.json({
            success: true,
            message: result.message,
            token: token,
            agent: result.agent
        });

        console.log('User logged in:', result.agent.email);

    } catch (error) {
        console.error('Login controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const register = async (req, res) => {
    logEndpointHit('register');
    
    try {
        const { firstName, lastName, phone, email, password } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, email, and password are required'
            });
        }

        if(!phone || isNaN(phone)) {
            return res.status(400).json({
                success: false,
                message: 'phone is required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        const formData = {
            firstName,
            lastName,
            phone,
            email,
            password // Will be hashed in the service
        };

        const result = await AuthService.register(formData);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        const token = generateToken(result.agentId);
        
        res.status(201).json({
            success: true,
            message: result.message,
            token: token,
            agentId: result.agentId
        });

        console.log('User registered:', email);

    } catch (error) {
        console.error('Registration controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const verifyToken = async (req, res) => {
    console.log('verifyToken endpoint hit');

    verifyTokenMiddleware(req, res, () => {
        res.status(200).json({ success: true, message: 'Valid token!' });
        console.log('valid user!');
    });
}

module.exports = {
    login,
    register,
    verifyToken
}