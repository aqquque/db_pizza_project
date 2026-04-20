const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
   logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Модели Pizza Delivery
db.Pizza = require("./pizza.model.js")(sequelize, Sequelize);
db.Ingredient = require("./ingredient.model.js")(sequelize, Sequelize);
db.PizzaIngredient = require("./pizzaingredient.model.js")(sequelize, Sequelize);
db.Client = require("./client.model.js")(sequelize, Sequelize);
db.Address = require("./address.model.js")(sequelize, Sequelize);
db.Courier = require("./courier.model.js")(sequelize, Sequelize);
db.Order = require("./order.model.js")(sequelize, Sequelize);
db.OrderItem = require("./orderitem.model.js")(sequelize, Sequelize);

// Связи
require("./references.model.js")(db);

module.exports = db;