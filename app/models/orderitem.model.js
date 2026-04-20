module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("order_item", {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'order_id',
      primaryKey: true
    },
    pizzaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'pizza_id',
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    priceAtOrder: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price_at_order'
    }
  }, {
    underscored: true,
    tableName: 'order_items',
    timestamps: true
  });

  return OrderItem;
};