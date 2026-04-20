const db = require("../models");
const Ingredient = db.Ingredient;

exports.create = (req, res) => {
  Ingredient.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Ingredient.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Ingredient.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Ingredient.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Ingredient.destroy({ where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};