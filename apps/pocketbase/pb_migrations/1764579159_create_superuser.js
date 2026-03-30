/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Get admin email and password from environment variables
    // Supports both PB_ADMIN_* and PB_SUPERUSER_* naming conventions
    const email = $os.getenv("PB_ADMIN_EMAIL") || $os.getenv("PB_SUPERUSER_EMAIL") || ""
    const password = $os.getenv("PB_ADMIN_PASSWORD") || $os.getenv("PB_SUPERUSER_PASSWORD") || ""
    
    // Skip migration if credentials are not provided
    if (!email || !password) {
        console.log("⚠️ Skipping superuser creation: PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set")
        return
    }
    
    // Check if superuser already exists
    try {
        const existing = app.findAuthRecordByEmail("_superusers", email)
        if (existing) {
            console.log("✅ Superuser already exists:", email)
            return
        }
    } catch (e) {
        // Record doesn't exist, continue with creation
    }
    
    // Create superuser record
    const superusers = app.findCollectionByNameOrId("_superusers")
    const record = new Record(superusers)
    
    record.set("email", email)
    record.set("password", password)
    
    app.save(record)
    console.log("✅ Superuser created successfully:", email)
})
