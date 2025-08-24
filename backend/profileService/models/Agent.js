const { createPool } = require('mysql2/promise');
const DatabaseManager = require('../../shared/databaseManager');

const dbManager = new DatabaseManager(createPool);

class Agent {
    constructor(data) {
        this.agentId = data.agentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.imageUrl = data.imageUrl;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static async findById(id) {
        try {
            const sql = `
                SELECT agentId, firstName, lastName, email, phone, imageUrl, createdAt, updatedAt 
                FROM agents 
                WHERE agentId = ?
            `;

            const [rows] = await dbManager.query(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            return new Agent(rows[0]);
        } catch (error) {
            console.error('Error finding agent by ID:', error);
            throw error;
        }
    }

    static async update(agentId, agentData) {
        try {
            const sql = `
                UPDATE agents
                SET firstName = ?, lastName = ?, email = ?, phone = ?
                WHERE agentId = ?
            `;
            const values = [
                agentData.firstName,
                agentData.lastName,
                agentData.email,
                agentData.phone,
                agentId
            ];

            const [result] = await dbManager.query(sql, values);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating agent:', error);
            throw error;
        }
    }

    static async updatePassword(agentId, newPasswordHash) {
        try {
            const sql = `
                UPDATE agents
                SET passwordHash = ?
                WHERE agentId = ?
            `;
            const values = [newPasswordHash, agentId];

            const [result] = await dbManager.query(sql, values);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating agent password:', error);
            throw error;
        }
    }

    static async updateImageURL(id, imageURL) {
        try {
            const sql = `
                UPDATE agents 
                SET imageUrl = ?
                WHERE agentId = ?
            `;
            const values = [imageURL, id];

            const [result] = await dbManager.query(sql, values);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating agent image URL:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const sql = `
                DELETE FROM agents 
                WHERE agentId = ?
            `;

            const [result] = await dbManager.query(sql, [id]);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting agent:', error);
            throw error;
        }
    }

    static async create(agentData) {
        try {
            const sql = `
                INSERT INTO agents (firstName, lastName, email, phone, imageUrl, passwordHash)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const values = [
                agentData.firstName,
                agentData.lastName,
                agentData.email,
                agentData.phone,
                agentData.imageUrl || null,
                agentData.passwordHash
            ];

            const [result] = await dbManager.query(sql, values);
            
            // Fetch the created agent
            return await Agent.findById(result.insertId);
        } catch (error) {
            console.error('Error creating agent:', error);
            throw error;
        }
    }

    // Get all agents with optional pagination
    static async findAll(limit = 50, offset = 0) {
        try {
            const sql = `
                SELECT agentId, firstName, lastName, email, phone, imageUrl, createdAt, updatedAt
                FROM agents
                ORDER BY createdAt DESC
                LIMIT ? OFFSET ?
            `;

            const [rows] = await dbManager.query(sql, [limit, offset]);
            
            return rows.map(row => new Agent(row));
        } catch (error) {
            console.error('Error finding all agents:', error);
            throw error;
        }
    }
}

module.exports = Agent;