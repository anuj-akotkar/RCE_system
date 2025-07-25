const createLogger = (service) => {
    return {
        info: (message, data = null) => {
            console.log(`ℹ️  [${service}] ${message}`, data ? data : '');
        },
        success: (message, data = null) => {
            console.log(`✅ [${service}] ${message}`, data ? data : '');
        },
        error: (message, error = null) => {
            console.error(`❌ [${service}] ${message}`, error ? error : '');
        },
        warn: (message, data = null) => {
            console.warn(`⚠️  [${service}] ${message}`, data ? data : '');
        }
    };
};

module.exports = createLogger;