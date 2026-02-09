// SQLite database configuration for task management

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Could not connect to the database.', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Function to create tasks table
const createTasksTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Could not create tasks table.', err);
        } else {
            console.log('Tasks table created or already exists.');
        }
    });
};

createTasksTable();

module.exports = db;
