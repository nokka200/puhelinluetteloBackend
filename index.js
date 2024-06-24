const express = require('express');
const app = express();

const PORT = 3001;

let numbers = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    console.log('GET /api/persons');
    response.json(numbers);
});

app.get('/info', (requests, response) => {
    response.send(`<p>Phone has info for ${numbers.length} people</p>\n<p>${new Date()}</p>`)
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});