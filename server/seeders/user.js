export default {
  signUp: {
    // res.message.body === "user successfully created"
    // res.statusCode === 201 
    fullAdminDetails: {
      username: 'user001',
      password: 'javascript',
      admin: true,
      email: 'user001@mail.com',
      membershipLevel: 'regular',
      // identifier: Sequelize.UUIDV4()
    },

    // res.body.message === "user successfully created"
    // res.statusCode === 201
    fullUserDetails: {
      username: 'user002',
      password: 'javascript',
      email: 'user002@mail.com',
      membershipLevel: 'regular',
      // identifier: Sequelize.UUIDV4()
    },

    // res.body.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nullUsername: {
      password: 'javascript',
      email: 'user003@mail.com',
      membershipLevel: 'regular',
    },

    // res.body.message === ""Invalid credentials supplied""
    // res.statusCode === 400
    nullEmail: {
      username: 'user004',
      password: 'javascript',
      membershipLevel: 'silver'
    },

    // Object.message === "No password supplied"
    // res.statusCode === 400
    nullPassword: {
      username: 'user004',
      membershipLevel: 'regular',
      email: 'user005@mail.com'
    },

    // Object.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nonUniqueValues: {
      username: 'user001',
      password: 'javascript',
      admin: true,
      email: 'user001@mail.com',
      membershipLevel: 'regular',
    },
  },

  /*
  signIn: {
    // Object.message === "user sign in is successful"
    correctValues: {
      username: 'user001',
      password: 'javascript'
    },

    // Plain text === Authentication failed: wrong password
    wrongPassword: {
      username: 'user001',
      password: 'none'
    },

    // Plain html === Cannot read property 'password' of null
    nullValues: {

    },

    // Plain html === Cannot read property 'password' of null
    wrongUsername: {
      username: 'user003',
      password: 'javascript'
    }
  }
  */
};
