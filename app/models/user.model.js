module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'courier'),
      allowNull: false,
      defaultValue: 'courier'
    },
    courierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'courier_id',
      comment: 'Связь с таблицей couriers (только для роли courier)'
    }
  }, {
    underscored: true,
    tableName: 'users'
  });

  return User;
};