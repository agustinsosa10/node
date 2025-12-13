require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./mongo");
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  
  // Validar que el ID sea un ObjectId válido de MongoDB
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return response.status(400).json({ error: "ID inválido" });
  // }

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "Persona no encontrada" });
      }
      response.json(person);
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({error: "id mal formado"})
    });
});

app.delete("/api/persons/:id", (request, response) => {
  
  Person.findByIdAndDelete(request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => console.error(error))
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({ error: "falta el nombre o el numero" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((personSaved) => {
    response.json(personSaved);
  });
});


app.use(express.static("dist"));
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
