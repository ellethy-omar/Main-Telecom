const shutdownManager = require('./shutdownManager')

class RedisMQ {
    constructor(createClient, options = {}) {
        this.createClient = createClient;

        // check if we are docker or nah
        const isDocker = process.env.IS_DOCKER === 'true';

        this.options = Object.keys(options).length === 0 && isDocker
            ? {
                socket: {
                    host: 'redis',
                    port: 6379,
                }
            }
            : options;

        this.isInitialized = false;
        this.initPromise = this.initializeClients();

        shutdownManager.registerCleanup(async () => {
            await this.initializeClients();         // Ensure clients are ready
            await this.disconnect();                // Now disconnect for real
        });
    }


    async initializeClients() {
        if (this.isInitialized) {
            return;
        }

        try {
            this.redisClient = this.createClient(this.options);
            this.redisPublisher = this.createClient(this.options);
            this.redisSubscriber = this.createClient(this.options);

            this.redisClient.on('error', err => console.error('Redis Client Error:', err));
            this.redisPublisher.on('error', err => console.error('Redis Publisher Error:', err));
            this.redisSubscriber.on('error', err => console.error('Redis Subscriber Error:', err));

            await Promise.all([
                this.redisClient.connect(),
                this.redisPublisher.connect(),
                this.redisSubscriber.connect()
            ]);

            this.isInitialized = true;
            console.log("Redis clients connected and ready");
        } catch (error) {
            console.error("Failed to initialize Redis clients:", error);
            throw error;
        }
    }

    async getRedisPublisher() {
        await this.initPromise;
        return this.redisPublisher;
    }

    async getRedisSubscriber() {
        await this.initPromise;
        return this.redisSubscriber;
    }

    async getRedisClient() {
        await this.initPromise;
        return this.redisClient;
    }

    async extractClients() {
        await this.initPromise;
        return {
            redisClient: this.redisClient,
            redisPublisher: this.redisPublisher,
            redisSubscriber: this.redisSubscriber
        };
    }

    async publish(channel, message) {
        await this.initPromise;
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        return await this.redisPublisher.publish(channel, messageStr);
    }

    async subscribe(channel, callback) {
        await this.initPromise;
        
        await this.redisSubscriber.subscribe(channel, (message) => {
            try {
                // ! Try to parse as JSON, fallback to string
                let parsedMessage;
                try {
                    parsedMessage = JSON.parse(message);
                } catch {
                    parsedMessage = message;
                }
                callback(parsedMessage, channel);
            } catch (error) {
                console.error(`Error processing message from channel ${channel}:`, error);
            }
        });
        
        console.log(`Subscribed to channel: ${channel}`);
    }

    async subscribeMultiple(subscriptions) {
        await this.initPromise;
        
        for (const { channel, callback } of subscriptions) {
            await this.subscribe(channel, callback);
        }
    }

    async unsubscribe(channel) {
        await this.initPromise;
        await this.redisSubscriber.unsubscribe(channel);
        console.log(`Unsubscribed from channel: ${channel}`);
    }

    async isReady() {
        try {
            await this.initPromise;
            return this.isInitialized;
        } catch {
            return false;
        }
    }

    async disconnect() {
        try {
            if (this.isInitialized) {
                await Promise.all([
                    this.redisClient.quit(),
                    this.redisPublisher.quit(),
                    this.redisSubscriber.quit()
                ]);
                this.isInitialized = false;
                console.log("Redis connections closed");
            }
        } catch (error) {
            console.error("Error closing Redis connections:", error);
            throw error;
        }
    }
}

module.exports = RedisMQ;