const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize WhatsApp client
const client = new Client();

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

// Task management storage
let tasks = [];

// Endpoint to add a task
app.post('/task', (req, res) => {
    const { userId, description } = req.body;
    if (!userId || !description) {
        return res.status(400).send('User ID and description are required.');
    }
    const task = { id: tasks.length + 1, userId, description, completed: false };
    tasks.push(task);
    res.status(201).send(task);
});

// Endpoint to get tasks by user ID
app.get('/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    const userTasks = tasks.filter(task => task.userId === userId);
    res.send(userTasks);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});