module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      identifier: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      membershipLevel: {
        field: 'membership_level',
        type: Sequelize.ENUM,
        values: ['regular', 'silver', 'gold', 'platinum'],
        allowNull: false,
        // defaultValue: 'regular'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }),
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('Users');
  }
};
