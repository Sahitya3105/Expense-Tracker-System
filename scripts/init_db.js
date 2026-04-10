const pool = require('../utils/databaseUtil');

async function initializeDatabase() {
    try {
        console.log("Connecting and creating tables...");
        
        // Ensure Categories table exists
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Categories table is ready.");

        // Ensure Expenses table exists
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category_id INT,
                expense_date DATE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);
        console.log("Expenses table is ready.");

        // Check if categories are empty and seed them
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM categories');
        if (rows[0].count === 0) {
            console.log("Seeding default categories...");
            const defaultCategories = [
                ['Food', 'All food and dining expenses'],
                ['Travel', 'Commute, flights, trains, etc.'],
                ['Shopping', 'Clothing, groceries, general shopping'],
                ['Utilities', 'Bills, electricity, internet, etc.'],
                ['Entertainment', 'Movies, games, subscriptions']
            ];
            
            for (let cat of defaultCategories) {
                await pool.execute('INSERT INTO categories (category_name, description) VALUES (?, ?)', cat);
            }
            console.log("Default categories seeded successfully!");
        } else {
            console.log("Categories already exist, skipping seed.");
        }

        console.log("Database initialized successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
}

initializeDatabase();
