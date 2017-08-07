module.exports = (sequelize, DataTypes) => {
  const BorrowHistory = sequelize.define('BorrowHistory', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    returnStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  });
  return BorrowHistory;
};
