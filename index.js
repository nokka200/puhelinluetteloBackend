require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Phone = require('./models/phone');




// Middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

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

// Http responses
app.get('/api/persons', (request, response) => {
    Phone.find({}).then(person => {
        response.json(person)
    });
});

app.get('/info', (requests, response) => {
    Phone.find({}).then(person => {
        response.send(`<p>Phone has info for ${person.length} people</p>\n<p>${new Date()}</p>`)
    });
});

app.get('/api/persons/:id', (request, response) => {
    Phone.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
});

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

// middlewarea
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    };

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});