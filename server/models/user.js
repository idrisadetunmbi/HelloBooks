export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    membershipLevel: {
      type: DataTypes.ENUM,
      values: ['regular', 'silver', 'gold', 'platinum'],
      allowNull: false
    },
  }, {
    classMethods: {
      associate: (models) => {

      }
    }
  });
  return User;
};
