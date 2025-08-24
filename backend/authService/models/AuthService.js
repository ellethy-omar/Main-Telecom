const { createPool } = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const DatabaseManager = require('../../shared/databaseManager');

const dbManager = new DatabaseManager(createPool);
const saltRounds = 12;  // ! Made a global variable, because by default we don't make an instance of this class
                        // ! Also, making const on every function call is overall bad for multiple requests, since it's a constant

class AuthService {
    constructor() {}

    static async register(formData) {
        try {
            const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

            const sql = `
                INSERT INTO agents (firstName, lastName, phone, email, passwordHash) 
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                formData.firstName,
                formData.lastName,
                formData.phone,
                formData.email,
                hashedPassword
            ];

            const result = await dbManager.query(sql, values);
            
            return {
                success: true,
                agentId: result.insertId,
                message: 'Agent registered successfully'
            };

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return {
                    success: false,
                    message: 'Email already exists'
                };
            }

            console.error('Registration error:', error);
            
            return {
                success: false,
                message: 'Registration failed',
                error: error.message
            };
        }
    }

    static async login(email, password) {
        try {
            const sql = `
                SELECT agentId, firstName, lastName, email, passwordHash, imageUrl, phone, createdAt, updatedAt
                FROM agents 
                WHERE email = ?
            `;

            const [rows] = await dbManager.query(sql, [email]);
            
            if (rows.length === 0) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                };
            }

            const agent = rows[0];
            
            const isPasswordValid = await bcrypt.compare(password, agent.passwordHash);
            
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                };
            }

            const { passwordHash, ...agentData } = agent;
            
            return {
                success: true,
                agent: agentData,
                message: 'Login successful'
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed',
                error: error.message
            };
        }
    }
}

module.exports = AuthService;