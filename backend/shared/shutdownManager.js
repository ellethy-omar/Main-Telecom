// ShutdownManager.js

class ShutdownManager {
    constructor() {
        this.cleanupCallbacks = [];
        this.isRegistered = false;
    }

    registerCleanup(fn) {
        if (typeof fn === 'function') {
            this.cleanupCallbacks.push(fn);
        }

        if (!this.isRegistered) {
            this._registerHooks();
            this.isRegistered = true;
        }
    }

    _registerHooks() {
        const shutdownHandler = async (signal) => {
            console.log(`${signal} received. Cleaning up resources...`);
            try {
                for (const fn of this.cleanupCallbacks) {
                    await fn();
                }
                console.log("Cleanup completed. Exiting...");
            } catch (err) {
                console.error("Error during shutdown cleanup:", err);
            } finally {
                process.exit(0);
            }
        };

        process.on('SIGINT', () => shutdownHandler('SIGINT'));
        process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    }
}

module.exports = new ShutdownManager();
