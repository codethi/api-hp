require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const Character = require("./models/Character");
const cors = require("cors");


const app = express();

const port =  process.env.PORT || 3000;

try {
  mongoose.connect(
    process.env.DATABASE_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("Banco de dados conectado!");
} catch (err) {
  console.log(`Erro ao conectar no banco de dados ${err}`);
}

app.use(express.json());
app.use(cors());

// GETALL - READ ALL
app.get("/character/all", async (req, res) => {
  const characters = await Character.find();

  if (characters.length === 0) {
    return res
      .status(404)
      .send({ message: "Não existem personagens cadastrados!" });
  }

  res.send(characters.filter(Boolean));
});

// getBYiD
app.get("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Id inválido!" });
    return;
  }

  const character = await Character.findById(id);

  if (!character) {
    return res.status(404).send({ message: "Personagem não encontrado!" });
  }

  res.send(character);
});

// POST - CREATE
app.post("/character/create", async (req, res) => {
  const { name, image, house, actor } = req.body;

  if (!name || !image || !house || !actor) {
    res.status(400).send({
      message: "Você não enviou todos os dados necessários para o cadastro",
    });
    return;
  }

  const character = await new Character({
    name,
    image,
    house,
    actor,
  });

  await character.save();

  res.send(character);
});

// PUT - UPDATE
app.put("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Id inválido!" });
    return;
  }

  const character = await Character.findById(id);

  if (!character) {
    return res.status(404).send({ message: "Personagem não encontrado!" });
  }

  const { name, image, house, actor } = req.body;

  if (!name || !image || !house || !actor) {
    res.status(400).send({
      message: "Você não enviou todos os dados necessários para a atualização",
    });
    return;
  }

  character.name = name;
  character.image = image;
  character.house = house;
  character.actor = actor

  await character.save()

  res.send(character);
});

// DELETE - DELETE

app.delete("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Id inválido!" });
    return;
  }

  const character = await Character.findById(id)

  if (!character) {
    return res.status(404).send({ message: "Esse personagem não existe!"})
  }

  await character.remove()

  res.send({ message: "Personagem removido com sucesso!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
