module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("address", {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'client_id'
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    house: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apartment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entrance: {
      type: DataTypes.STRING,
      allowNull: true
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_main'
    }
  }, {
    underscored: true,
    tableName: 'addresses'
  });

  return Address;
};