module.exports = (sequelize, DataTypes) => {
  const Courier = sequelize.define("courier", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('free', 'busy', 'offline'),
      defaultValue: 'free'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'hire_date'
    }
  }, {
    underscored: true,
    tableName: 'couriers'
  });

  return Courier;
};