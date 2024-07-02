require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Phone = require('./models/phone');




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
app.use(cors());
app.use(express.static('dist'));


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
    Phone.find({}).then(person => {
        response.json(person)
    });
});

app.get('/info', (requests, response) => {
    response.send(`<p>Phone has info for ${numbers.length} people</p>\n<p>${new Date()}</p>`)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number.parseInt(request.params.id);
    const number = numbers.find(number => number.id === id);

    if (number) {
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
    console.log('body', body);

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' });
    }

    const phone = new Phone({
        name: body.name,
        number: body.number,
    });

    phone.save().then(savedPhone => {
        response.json(savedPhone)
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});