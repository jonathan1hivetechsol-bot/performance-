import Pocketbase from 'pocketbase';

/**
 * PocketBase Client Configuration
 * Automatically uses environment variable VITE_POCKETBASE_URL
 * Falls back to /api for relative path
 */

// Get PocketBase URL from environment or use fallback
const getPocketBaseUrl = () => {
    const envUrl = import.meta.env.VITE_POCKETBASE_URL;
    
    if (envUrl) {
        console.log('✅ PocketBase URL (from .env):', envUrl);
        return envUrl;
    }
    
    // Fallback: use relative /api path
    console.warn('⚠️ VITE_POCKETBASE_URL not set, using /api');
    return '/api';
};

const POCKETBASE_API_URL = getPocketBaseUrl();

// Create PocketBase client
const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

// Verify connection on startup (non-blocking)
// Note: .on() method is not available in this PocketBase SDK version
// Connection errors will be handled in each API call
(async () => {
    try {
        const health = await pocketbaseClient.health.check();
        console.log('✅ PocketBase Health Check Passed:', health);
    } catch (error) {
        console.warn('⚠️ PocketBase not responding yet:', error.message);
        console.log('📌 Make sure PocketBase is running on:', POCKETBASE_API_URL);
    }
})();

export default pocketbaseClient;
export { pocketbaseClient, POCKETBASE_API_URL };
