const { createPool } = require('mysql2/promise');
const DatabaseManager = require('../../shared/databaseManager');

const dbManager = new DatabaseManager(createPool);

class Ticket {
    constructor(data) {
        this.ticketId = data.ticketId;
        this.phone = data.phone;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.resolvedAt = data.resolvedAt;
        this.assignedAgentId = data.assignedAgentId;
    }

    static async findById(id) {
        try {
            const sql = `SELECT * FROM tickets WHERE ticketId = ?`;
            const [rows] = await dbManager.query(sql, [id]);

            return rows.length ? new Ticket(rows[0]) : null;
        } catch (error) {
            console.error('Error finding ticket by ID:', error);
            throw error;
        }
    }

    static async doesPhoneExist(phone) {
        try {
            const sql = `SELECT * FROM contacts WHERE phone = ?`;
            const [rows] = await dbManager.query(sql, [phone]);

            return rows.length > 0;
        } catch (error) {
            console.error('Error checking if phone exists in contacts:', error);
            throw error;
        }
    }

    static async doesAgentExist(agentId) {
        try {
            const sql = `SELECT * FROM agents WHERE agentId = ?`;
            const [rows] = await dbManager.query(sql, [agentId]);

            return rows.length > 0;
        } catch (error) {
            console.error('Error checking if agent exists:', error);
            throw error;
        }
    }

    static async findByAgentId(agentId) {
        try {
            const sql = `SELECT * FROM tickets WHERE assignedAgentId = ? ORDER BY createdAt DESC`;
            const [rows] = await dbManager.query(sql, [agentId]);

            return rows.map(row => new Ticket(row));
        } catch (error) {
            console.error('Error finding tickets by agent ID:', error);
            throw error;
        }
    }

    static async findByContactId(phone) {
        try {
            const sql = `SELECT * FROM tickets WHERE phone = ? ORDER BY createdAt DESC`;
            const [rows] = await dbManager.query(sql, [phone]);

            return rows.map(row => new Ticket(row));
        } catch (error) {
            console.error('Error finding tickets by contact phone:', error);
            throw error;
        }
    }

    static async findByStatus(status) {
        const allowed = ['open', 'in_progress', 'resolved', 'closed'];
        if (!allowed.includes(status)) {
            throw new Error('Invalid status passed');
        }

        try {
            const sql = `SELECT * FROM tickets WHERE status = ? ORDER BY createdAt DESC`;
            const [rows] = await dbManager.query(sql, [status]);

            return rows.map(row => new Ticket(row));
        } catch (error) {
            console.error('Error finding tickets by status:', error);
            throw error;
        }
    }

    static async findByStatusForCertainAgent(status, agentId) {
        const allowed = ['open', 'in_progress', 'resolved', 'closed'];
        if (!allowed.includes(status)) {
            throw new Error('Invalid status passed');
        }

        try {
            const sql = `
                SELECT * FROM tickets 
                WHERE 
                status = ? AND assignedAgentId = ?
                ORDER BY createdAt DESC`;
            const [rows] = await dbManager.query(sql, [status, agentId]);

            return rows.map(row => new Ticket(row));
        } catch (error) {
            console.error('Error finding tickets by status:', error);
            throw error;
        }
    }

    static async createTicket(data) {
        try {
            const sql = `
                INSERT INTO tickets (phone, title, description, status, assignedAgentId)
                VALUES (?, ?, ?, ?, ?)
            `;
            const values = [
                data.phone,
                data.title,
                data.description,
                data.status || 'open',
                data.assignedAgentId || null
            ];

            const [result] = await dbManager.query(sql, values);
            return await Ticket.findById(result.insertId);
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    static async updateTicket(id, data) {
        try {
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(data)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            values.push(id);

            const sql = `UPDATE tickets SET ${fields.join(', ')} WHERE ticketId = ?`;

            const [result] = await dbManager.query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    }

    static async deleteById(id) {
        try {
            const sql = `DELETE FROM tickets WHERE ticketId = ?`;
            const [result] = await dbManager.query(sql, [id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }

    // ! === Analytics methods ===
    // ? may move later to analytics service still don't really know.

    static async countByStatus() {
        try {
            const sql = `
                SELECT status, COUNT(*) as count
                FROM tickets
                GROUP BY status
            `;
            const [rows] = await dbManager.query(sql);
            return rows;
        } catch (error) {
            console.error('Error counting tickets by status:', error);
            throw error;
        }
    }

    static async averageResolutionTime() {
        try {
            const sql = `
                SELECT 
                    AVG(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) AS avgResolutionHours
                FROM tickets
                WHERE resolvedAt IS NOT NULL AND resolvedAt > createdAt
            `;
            const [rows] = await dbManager.query(sql);
            return rows[0].avgResolutionHours ?? 0; // fallback to 0 if null
        } catch (error) {
            console.error('Error calculating average resolution time:', error);
            throw error;
        }
    }


    static async ticketsPerAgent() {
        try {
            const sql = `
                SELECT 
                    a.agentId,
                    CONCAT(a.firstName, ' ', a.lastName) AS agentName,
                    COUNT(t.ticketId) AS totalTickets
                FROM agents a
                LEFT JOIN tickets t ON a.agentId = t.assignedAgentId
                GROUP BY a.agentId
            `;
            const [rows] = await dbManager.query(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching ticket count per agent:', error);
            throw error;
        }
    }

    static async openTicketsPerAgent() {
        try {
            const sql = `
                SELECT 
                    a.agentId,
                    CONCAT(a.firstName, ' ', a.lastName) AS agentName,
                    COUNT(t.ticketId) AS totalOpenOrInProgressTickets
                FROM agents a
                LEFT JOIN tickets t 
                    ON a.agentId = t.assignedAgentId 
                    AND t.status IN ('open', 'in_progress')
                GROUP BY a.agentId
            `;
            const [rows] = await dbManager.query(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching open/in-progress ticket count per agent:', error);
            throw error;
        }
    }


    static async unresolvedTicketsAging() {
        try {
            const sql = `
                SELECT 
                    ticketId, title, status, createdAt, 
                    TIMESTAMPDIFF(HOUR, createdAt, NOW()) AS hoursOpen
                FROM tickets
                WHERE status IN ('open', 'in_progress')
                ORDER BY createdAt ASC
            `;
            const [rows] = await dbManager.query(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching unresolved ticket aging:', error);
            throw error;
        }
    }
}

module.exports = Ticket;