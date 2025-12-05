require('dotenv').config()
const express = require("express");
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./mongo')

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then( persons => {
      response.json(persons)
    })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById( request.params.id).then( person => {
      response.json(person)
    })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({ error: "falta el nombre o el numero" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save()
    .then( personSaved => {
      response.json(personSaved)
    })
});

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})