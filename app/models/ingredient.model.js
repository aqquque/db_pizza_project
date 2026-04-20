module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define("ingredient", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    extraPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'extra_price'
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'in_stock'
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'ingredients'
  });

  return Ingredient;
};