const Ticket = require('../models/Ticket');

const getTicketById = async (req, res) => {
    const ticketId = parseInt(req.query.ticketId);
    console.log('getTicketById endpoint hit for ticketId: ', ticketId);
    if (!ticketId || isNaN(ticketId)) {
        return res.status(400).json({ error: 'Invalid or missing ticket ID' });
    }

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            console.log('Ticket not found');
            return res.status(404).json({ error: 'Ticket not found' });
        }
        console.log('Ticket found: ', ticket);

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicketByAgentId = async (req, res) => {
    const agentId = req.user.id;
    console.log('getTicketByAgentId endpoint hit for agentId: ', agentId);
    
    try {
        const tickets = await Ticket.findByAgentId(agentId);
        console.log('tickets: ', tickets);
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getTicketsByContact = async (req, res) => {
    const phone = req.query.phone;
    console.log('getTicketsByContact endpoint hit for phone: ', phone);
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const tickets = await Ticket.findByContactId(phone);
        console.log('tickets: ', tickets);
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicketsByStatusForCertainAgent = async (req, res) => {
    const status = req.query.status;
    const agentId = req.user.id;
    const allowed = ['open', 'in_progress', 'resolved', 'closed'];
    console.log('getTicketsByStatus endpoint hit for status: ', status);
    if (!allowed.includes(status)) {
        console.log('Invalid Status');
        return res.status(400).json({ error: 'Invalid or missing status' });
    }

    try {
        const tickets = await Ticket.findByStatusForCertainAgent(status, agentId);
        console.log('tickets: ', tickets);
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicketsByStatus = async (req, res) => {
    const status = req.query.status;
    const allowed = ['open', 'in_progress', 'resolved', 'closed'];
    console.log('getTicketsByStatus endpoint hit for status: ', status);
    if (!allowed.includes(status)) {
        console.log('Invalid Status');
        return res.status(400).json({ error: 'Invalid or missing status' });
    }

    try {
        const tickets = await Ticket.findByStatus(status);
        console.log('tickets: ', tickets);
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createTicket = async (req, res) => {
    console.log('createTicket endpoint hit ');

    const { phone, title, description, status } = req.body;
    
    if (!phone || !title || !description) {
        console.log('Invalid parameters');
        return res.status(400).json({ error: 'Missing required fields: phone, title, description' });
    }

    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (status && !allowedStatuses.includes(status)) {
        console.log('Invalid Status');
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const assignedAgentId = req.user.id;
    
    try {
        const [agentExists, phoneExists] = await Promise.all([
            Ticket.doesAgentExist(assignedAgentId),
            Ticket.doesPhoneExist(phone)
        ]);

        if (!agentExists) {
            console.log('Agent not found');
            return res.status(404).json({ error: 'Assigned agent not found' });
        }

        if (!phoneExists) {
            console.log('Phone not found');
            return res.status(404).json({ error: 'Contact with this phone number does not exist' });
        }

        const ticket = await Ticket.createTicket({ phone, title, description, status, assignedAgentId });
        console.log('ticket: ', ticket);
        res.status(201).json(ticket);
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTicket = async (req, res) => {
    const ticketId = parseInt(req.query.ticketId);
    console.log('updateTicket endpoint hit ');
    if (!ticketId || isNaN(ticketId)) {
        console.log('Invalid ticketId');
        return res.status(400).json({ error: 'Invalid or missing ticket ID' });
    }

    const { title, description, status } = req.body;

    if (!title || !description) {
        console.log('Invalid parameters');
        return res.status(400).json({ error: 'Missing required fields: phone, title, description' });
    }

    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (status && !allowedStatuses.includes(status)) {
        console.log('Invalid Status');
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const updated = await Ticket.updateTicket(ticketId, req.body);

        if (!updated) {
            console.log('No update');
            return res.status(404).json({ error: 'Ticket not found or not updated' });
        }

        console.log('Updated successfully');

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteTicket = async (req, res) => {
    const ticketId = parseInt(req.query.ticketId);
    console.log('deleteTicket endpoint hit')
    if (isNaN(ticketId)) {
        return res.status(400).json({ error: 'Invalid or missing ticket ID' });
    }

    try {
        const deleted = await Ticket.deleteById(ticketId);

        if (!deleted) {
            console.log('Ticket not found to delete');
            return res.status(404).json({ error: 'Ticket not found or already deleted' });
        }

        console.log('deleted ticket successfully');

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    getTicketById,
    getTicketByAgentId,
    getTicketsByContact,
    getTicketsByStatus,
    getTicketsByStatusForCertainAgent,
    createTicket,
    updateTicket,
    deleteTicket
}
