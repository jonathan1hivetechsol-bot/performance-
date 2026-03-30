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

// Add error handler for connection issues
pocketbaseClient.on('error', (error) => {
    console.error('❌ PocketBase Connection Error:', error);
});

// Log successful connection
pocketbaseClient.on('login', () => {
    console.log('✅ Connected to PocketBase');
});

// Verify connection on startup (non-blocking)
(async () => {
    try {
        const health = await pocketbaseClient.health.check();
        console.log('🏥 PocketBase Health:', health);
    } catch (error) {
        console.error('⚠️ PocketBase not responding yet:', error.message);
        console.log('📌 Make sure PocketBase is running on:', POCKETBASE_API_URL);
    }
})();

export default pocketbaseClient;
export { pocketbaseClient, POCKETBASE_API_URL };
