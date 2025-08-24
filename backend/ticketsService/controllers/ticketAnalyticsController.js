const Ticket = require('../models/Ticket');

const getCountByStatus = async (req, res) => {
    try {
        console.log('getCountByStatus endpoint hit');
        const result = await Ticket.countByStatus();
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAverageResolutionTime = async (req, res) => {
    try {
        console.log('getAverageResolutionTime endpoint hit');
        const avg = await Ticket.averageResolutionTime();
        console.log(avg);
        res.json({ averageResolutionHours: avg });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicketsPerAgent = async (req, res) => {
    try {
        console.log('getTicketsPerAgent endpoint hit');
        const result = await Ticket.ticketsPerAgent();
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicketsOpenPerAgent = async (req, res) => {
    try {
        console.log('getTicketsOpenPerAgent endpoint hit');
        const result = await Ticket.openTicketsPerAgent();
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getUnresolvedAging = async (req, res) => {
    try {
        console.log('getUnresolvedAging endpoint hit');
        const result = await Ticket.unresolvedTicketsAging();
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAverageResolutionTime,
    getCountByStatus,
    getTicketsPerAgent,
    getUnresolvedAging,
    getTicketsOpenPerAgent
}