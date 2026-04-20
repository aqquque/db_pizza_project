module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("order", {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'order_number'
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'client_id'
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'address_id'
    },
    courierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'courier_id'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount'
    },
    status: {
      type: DataTypes.ENUM('new', 'cooking', 'delivering', 'delivered', 'cancelled'),
      defaultValue: 'new'
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'order_date'
    },
    deliveryTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivery_time'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'cash',
      field: 'payment_method'
    }
  }, {
    underscored: true,
    tableName: 'orders'
  });

  return Order;
};