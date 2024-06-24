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

app.get('/api/persons/:id', (request, response) => {
    const id = Number.parseInt(request.params.id);
    const number = numbers.find(number => number.id === id);
    
    if(number) {
        response.json(number);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number.parseInt(request.params.id);
    console.log('id: ', id);
    numbers = numbers.filter(number => number.id !== id);

    console.log('DELETE /api/persons/:id')
    response.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});