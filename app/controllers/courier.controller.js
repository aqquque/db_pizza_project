const db = require("../models");
const Courier = db.Courier;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  Courier.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Courier.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Courier.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Courier.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Courier.destroy({ where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Получить свободных курьеров
exports.getFreeCouriers = (req, res) => {
  Courier.findAll({ where: { status: 'free' } })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Назначить курьера на заказ (raw SQL)
exports.assignToOrder = async (req, res) => {
  const { courierId, orderId } = req.body;
  try {
    await db.sequelize.query(
      `UPDATE orders SET courier_id = ?, status = 'delivering' WHERE id = ?`,
      {
        replacements: [courierId, orderId],
        type: QueryTypes.UPDATE
      }
    );
    await Courier.update({ status: 'busy' }, { where: { id: courierId } });
    res.send({ message: "Courier assigned successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};