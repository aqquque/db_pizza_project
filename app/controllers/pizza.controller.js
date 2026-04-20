const db = require("../models");
const Pizza = db.Pizza;
const Ingredient = db.Ingredient;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (!req.body.name || !req.body.price) {
    res.status(400).send({ message: "Name and price are required!" });
    return;
  }
  Pizza.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Pizza.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Pizza.findByPk(id)
    .then(data => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Pizza with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Pizza.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) res.send({ message: "Pizza updated successfully." });
      else res.status(404).send({ message: `Cannot update pizza with id=${id}.` });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Pizza.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) res.send({ message: "Pizza deleted successfully!" });
      else res.status(404).send({ message: `Cannot delete pizza with id=${id}.` });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

// Получить все ингредиенты для пиццы
exports.getIngredients = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.sequelize.query(
      `SELECT i.*, pi.quantity, pi.is_required 
       FROM ingredients i
       JOIN pizza_ingredients pi ON i.id = pi.ingredient_id
       WHERE pi.pizza_id = ?`,
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

// Постраничный вывод
exports.findAllPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;

  try {
    const data = await Pizza.findAndCountAll({
      limit: size,
      offset: offset
    });
    res.send({
      totalItems: data.count,
      items: data.rows,
      totalPages: Math.ceil(data.count / size),
      currentPage: page
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};