const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToAD, disconnectFromAD, addUser, client } = require('./ldapClient.js');
const { searchUser } = require('./ldapSearch.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to LDAP
app.post('/connect', async (req, res) => {
    try {
        await connectToAD();
        res.json({ message: 'Connected to LDAP' });
    } catch (error) {
        res.status(500).json({ error: 'Connection failed', details: error.message });
    }
});

// Search for a user
app.get('/search', async (req, res) => {
    const { user } = req.query;
    try {
        const exists = await searchUser(user);
        res.json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
});

// Add a new user
app.post('/add', async (req, res) => {
    try {
        await addUser(req.body);
        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user', details: error.message });
    }
});

// Disconnect from LDAP
app.post('/disconnect', (req, res) => {
    try {
        disconnectFromAD();
        res.json({ message: 'Disconnected from LDAP' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to disconnect', details: error.message });
    }
});

// Check LDAP connection status
app.get('/status', (req, res) => {
    res.json({ connected: client.connected ? true : false });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
