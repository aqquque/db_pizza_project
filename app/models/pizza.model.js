module.exports = (sequelize, DataTypes) => {
  const Pizza = sequelize.define("pizza", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    isVegetarian: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_vegetarian'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url'
    }
  }, {
    underscored: true,
    tableName: 'pizzas'
  });

  return Pizza;
};