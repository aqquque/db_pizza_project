module.exports = (db) => {
  // Pizza ↔ Ingredient (Many-to-Many через PizzaIngredient)
  db.Pizza.belongsToMany(db.Ingredient, {
    through: db.PizzaIngredient,
    foreignKey: 'pizza_id',
    otherKey: 'ingredient_id'
  });
  db.Ingredient.belongsToMany(db.Pizza, {
    through: db.PizzaIngredient,
    foreignKey: 'ingredient_id',
    otherKey: 'pizza_id'
  });

  // Client → Address (One-to-Many)
  db.Client.hasMany(db.Address, { foreignKey: 'client_id' });
  db.Address.belongsTo(db.Client, { foreignKey: 'client_id' });

  // Client → Order (One-to-Many)
  db.Client.hasMany(db.Order, { foreignKey: 'client_id' });
  db.Order.belongsTo(db.Client, { foreignKey: 'client_id' });

  // Courier → Order (One-to-Many)
  db.Courier.hasMany(db.Order, { foreignKey: 'courier_id' });
  db.Order.belongsTo(db.Courier, { foreignKey: 'courier_id' });

  // Address → Order (One-to-Many)
  db.Address.hasMany(db.Order, { foreignKey: 'address_id' });
  db.Order.belongsTo(db.Address, { foreignKey: 'address_id' });

  // Order ↔ Pizza (Many-to-Many через OrderItem)
  db.Order.belongsToMany(db.Pizza, {
    through: db.OrderItem,
    foreignKey: 'order_id',
    otherKey: 'pizza_id'
  });
  db.Pizza.belongsToMany(db.Order, {
    through: db.OrderItem,
    foreignKey: 'pizza_id',
    otherKey: 'order_id'
  });
};