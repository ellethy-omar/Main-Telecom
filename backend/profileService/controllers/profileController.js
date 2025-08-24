const Agent = require('../models/Agent');
const { isValidEmail } = require('../utils/validators');

const RedisMQConfig = require('../../shared/redisMQConfig');
const { createClient }  = require('redis');
const redisMQ = new RedisMQConfig(createClient);

const eventsWithHandlers = require('./eventsWithHandlers')

redisMQ.subscribeMultiple(eventsWithHandlers);

const getAgentProfile = async(req, res) => {
    try {
        const agentId = req.user.id;
        console.log('getAgentProfile endpoint hit for agentId:', agentId);
        const agent = await Agent.findById(agentId);

        console.log('Agent profile fetched:', agent);
        
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(200).json(agent);
    } catch (err) {
        console.error('Error fetching agent profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateAgentProfile = async (req, res) => {
    try {
        const agentId = req.user.id;
        console.log('getAgentProfile endpoint hit for agentId:', agentId);
        console.log(req.body);
        const { firstName, lastName, email, phone } = req.body;

        if (!firstName || !lastName || !email || !phone || isNaN(phone) || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid parameters'});
        }

        const agentData = { firstName, lastName, email, phone }

        const success = await Agent.update(agentId, agentData);

        if (!success) {
            return res.status(404).json({ message: 'Agent not found or not updated' });
        }

        const agent = await Agent.findById(agentId);

        res.status(200).json({ 
            message: 'Agent updated successfully',
            agent: agent
         });

         console.log(`Updated profile successfully of agent with id: ${agentId} to be: ${agent}`)
    } catch (err) {
        console.error('Error updating agent:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getAgentProfile,
    updateAgentProfile
}