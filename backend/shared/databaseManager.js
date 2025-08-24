const shutdownManager = require('./shutdownManager');

class DatabaseManager {
    constructor(mysqlCreatePool, options = {}) {
        this.createPool = mysqlCreatePool;
        
        const isDocker = process.env.IS_DOCKER === 'true';
        
        this.options = Object.keys(options).length === 0 
            ? {
                host: process.env.REMOTE_SERVER || (isDocker ? 'mysql' : 'localhost'),
                user: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                port: parseInt(process.env.DATABASE_PORT) || 3306,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            }
            : options;

        this.pool = null;
        this.isInitialized = false;

        this.initialize();

        shutdownManager.registerCleanup(async () => {
            await this.initialize();        // Ensure pool is initialized
            await this.disconnect();        // Then disconnect
        });
    }

    async initialize() {
        if (this.isInitialized) {
            return this.pool;
        }

        try {
            this.pool = this.createPool(this.options);
            
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            
            this.isInitialized = true;
            console.log("MySQL pool initialized, connected to database and ready.");
            return this.pool;
        } catch (error) {
            console.error("Failed to initialize MySQL pool:", error);
            throw error;
        }
    }

    async getPool() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.pool;
    }

    async query(sql, params = []) {
        const pool = await this.getPool();
        return await pool.execute(sql, params);
    }

    async transaction(callback) {
        const pool = await this.getPool();
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            const result = await callback(connection);
            
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.isInitialized = false;
            console.log("MySQL connections closed");
        }
    }
}

module.exports = DatabaseManager;