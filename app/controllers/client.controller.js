const db = require("../models");
const Client = db.Client;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.phone) {
    res.status(400).send({ message: "First name, last name and phone are required!" });
    return;
  }
  Client.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Client.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Client.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Client.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Client.destroy({ where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Получить все заказы клиента
exports.getClientOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.sequelize.query(
      `SELECT o.*, a.street, a.house, a.apartment, c.first_name as courier_name
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       LEFT JOIN couriers c ON o.courier_id = c.id
       WHERE o.client_id = ?
       ORDER BY o.order_date DESC`,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};