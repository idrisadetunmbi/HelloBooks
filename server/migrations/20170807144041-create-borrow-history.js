module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BorrowHistories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bookId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    returnStatus: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('BorrowHistories')
};
