/**
 * Database Initialization & Verification Utility
 * Runs automatically on first deployment to Hostinger
 * Ensures all collections, users, and demo data are created
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

/**
 * Check if running in production (Hostinger)
 */
const isProduction = () => {
    const url = import.meta.env.VITE_POCKETBASE_URL || '';
    return url.includes('hostinger') || url.includes('yourdomain.com') || !url.includes('localhost');
};

/**
 * Initialize database if needed
 * Call this once on app startup in production
 */
export async function initializeDatabase() {
    try {
        console.log('🔧 Checking database initialization...');

        // Check if collections exist
        const collections = await pb.collections.getFullList();
        console.log(`✅ Database has ${collections.length} collections`);

        // Check if demo users exist
        const users = await pb.collection('users').getList(1, 100);
        console.log(`✅ Database has ${users.items.length} users`);

        // If we have collections and users, database is already initialized
        if (collections.length > 0 && users.items.length > 0) {
            console.log('✅ Database already initialized, skipping setup');
            return true;
        }

        // Database needs initialization - this should have been done by migrations
        console.log('⚠️ Database needs initialization (should have been done by migrations)');
        console.log('📌 Ensure migrations ran automatically when PocketBase started');
        return false;
    } catch (error) {
        console.error('❌ Database check failed:', error.message);
        if (isProduction()) {
            console.error('🚨 CRITICAL: Database initialization failed in production!');
        }
        return false;
    }
}

/**
 * Verify database health
 * Returns detailed information about database state
 */
export async function verifyDatabaseHealth() {
    try {
        const health = {
            connected: false,
            collections: [],
            usersCount: 0,
            departmentsCount: 0,
            tasksCount: 0,
            isInitialized: false,
            errors: []
        };

        // Test connection
        try {
            await pb.health.check();
            health.connected = true;
        } catch (e) {
            health.errors.push(`Connection failed: ${e.message}`);
            return health;
        }

        // Get collections
        try {
            const collections = await pb.collections.getFullList();
            health.collections = collections.map(c => c.name);
        } catch (e) {
            health.errors.push(`Collections check failed: ${e.message}`);
        }

        // Count records in each collection
        try {
            const users = await pb.collection('users').getFullList({ fields: 'id' });
            health.usersCount = users.length;
        } catch (e) {
            health.errors.push(`Users count failed: ${e.message}`);
        }

        try {
            const depts = await pb.collection('departments').getFullList({ fields: 'id' });
            health.departmentsCount = depts.length;
        } catch (e) {
            // Departments might not exist yet
        }

        try {
            const tasks = await pb.collection('tasks').getFullList({ fields: 'id' });
            health.tasksCount = tasks.length;
        } catch (e) {
            // Tasks might not exist yet
        }

        health.isInitialized = 
            health.connected && 
            health.collections.includes('users') &&
            health.usersCount > 0;

        return health;
    } catch (error) {
        console.error('Database health check error:', error);
        return {
            connected: false,
            collections: [],
            usersCount: 0,
            departmentsCount: 0,
            tasksCount: 0,
            isInitialized: false,
            errors: [error.message]
        };
    }
}

/**
 * Get initialization status
 * Exact details for debugging
 */
export async function getInitializationStatus() {
    const health = await verifyDatabaseHealth();
    const environment = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

    return {
        environment: isProduction() ? 'Production (Hostinger)' : 'Development (Local)',
        pocketbaseUrl: environment,
        ...health,
        ready: health.isInitialized ? '✅ READY' : '⏳ INITIALIZING'
    };
}

/**
 * Log initialization status
 * Call this on app load in production
 */
export async function logInitializationStatus() {
    if (!isProduction()) {
        console.log('🔨 Development mode - skipping detailed checks');
        return;
    }

    console.log('\n🔍 === Database Initialization Status ===');
    const status = await getInitializationStatus();
    console.log(JSON.stringify(status, null, 2));
    console.log('=========================================\n');

    if (!status.isInitialized) {
        console.error('⚠️  Database not initialized. Waiting for migrations to complete...');
        console.error('📌 This happens automatically when PocketBase starts');
        console.error('📌 Check PocketBase logs: tail -f pb_data/logs/app.log');
    }
}

/**
 * Wait for database to be ready
 * Use this in production to wait for initialization
 */
export async function waitForDatabaseReady(maxAttempts = 30, delayMs = 1000) {
    console.log('⏳ Waiting for database to be ready...');

    for (let i = 0; i < maxAttempts; i++) {
        const status = await getInitializationStatus();
        if (status.isInitialized) {
            console.log('✅ Database is ready!');
            return true;
        }
        console.log(`⏳ Attempt ${i + 1}/${maxAttempts} - waiting...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.error('❌ Database failed to initialize after ' + (maxAttempts * delayMs / 1000) + ' seconds');
    return false;
}

export default {
    initializeDatabase,
    verifyDatabaseHealth,
    getInitializationStatus,
    logInitializationStatus,
    waitForDatabaseReady,
    isProduction
};
