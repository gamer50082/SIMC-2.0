const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle both GET and POST requests for querying timetable
app.all('/api/query', (req, res) => {
    const params = req.method === 'POST' ? req.body : req.query;
    const { timeframe, weektype, day } = params;

    if (!timeframe || !weektype || !day) {
        return res.status(400).json({ error: 'Timeframe, weektype, and day parameters are required' });
    }

    const [start, end] = timeframe.split('-');
    if (!start || !end) {
        return res.status(400).json({ error: 'Invalid timeframe format. Use hh:mm-hh:mm' });
    }

    fs.readFile(path.join(__dirname, 'timetable.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read timetable data' });
        }

        const timetable = JSON.parse(data).timetable;
        const entry = timetable.find(item => 
            item.timeframe.start === start &&
            item.timeframe.end === end &&
            item.weektype === weektype &&
            item.day.toLowerCase() === day.toLowerCase()
        );

        if (entry) {
            res.json(entry.classes);
        } else {
            res.status(404).json({ error: 'No data found for the given parameters' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});