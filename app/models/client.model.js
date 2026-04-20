module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define("client", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'loyalty_points'
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'registration_date'
    }
  }, {
    underscored: true,
    tableName: 'clients'
  });

  return Client;
};