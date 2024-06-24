const express = require('express');
const morgan = require('morgan');
const app = express();


const PORT = 3001;

// Muista middleware!
app.use(express.json());
morgan.token('post', (req, res) => {
    return JSON.stringify(req.body)
})
app.use((req, res, next) => {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :post')(req, res, next);
    } else {
        morgan('tiny')(req, res, next);
    }
});
    
    
    
//app.use(morgan('tiny'));

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
    numbers = numbers.filter(number => number.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Nimi tai numero puuttuu'
        });  
    };

    if (numbers.find(number => number.name === body.name)) { 
        return response.status(400).json({
            error: 'Nimi on jo listalla'
        });  
    };

    const number = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    };

    numbers = numbers.concat(number);

    response.json(number);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});