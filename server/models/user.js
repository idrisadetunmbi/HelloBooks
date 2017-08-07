// const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    identifier: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    membershipLevel: {
      field: 'membership_level',
      type: DataTypes.ENUM,
      values: ['regular', 'silver', 'gold', 'platinum'],
      allowNull: false,
      // defaultValue: 'regular'
    },
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });
  return User;
};
