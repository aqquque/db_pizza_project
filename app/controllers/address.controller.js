const db = require("../models");
const Address = db.Address;

exports.create = (req, res) => {
  Address.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Address.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Address.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Address.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Address.destroy({ where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Получить адреса клиента
exports.getByClient = (req, res) => {
  const clientId = req.params.clientId;
  Address.findAll({ where: { clientId: clientId } })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};