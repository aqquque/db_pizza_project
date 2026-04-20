module.exports = (sequelize, DataTypes) => {
  const PizzaIngredient = sequelize.define("pizza_ingredient", {
    pizzaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'pizza_id',
      primaryKey: true
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ingredient_id',
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_required'
    }
  }, {
    underscored: true,
    tableName: 'pizza_ingredients',
    timestamps: true
  });

  return PizzaIngredient;
};