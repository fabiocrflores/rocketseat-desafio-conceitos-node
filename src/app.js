const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000);

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ erro: 'Repositório não econtrado.'});
  }

  return next();
}

app.use('/repositories/:id', checkRepositoryExists);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = { id: uuid(), url, title, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  var likes = repositories[repositoryIndex].likes;
  const repository = {
    id,
    url,
    title,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  var likes = repositories[repositoryIndex].likes + 1;
  repositories[repositoryIndex].likes = likes;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
