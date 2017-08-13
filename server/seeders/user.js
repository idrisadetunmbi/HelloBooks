export default {
  signUp: {
    // res.body.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nullUsername: {
      password: 'javascript',
      email: 'user003@mail.com',
      membershipLevel: 'regular',
    },

    // res.body.message === "Invalid credentials supplied"
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

    // res.body.message === "user successfully created"
    // res.statusCode === 201
    fullUserDetails: {
      username: 'user002',
      password: 'javascript',
      email: 'user002@mail.com',
      membershipLevel: 'regular'
    },

    // Object.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nonUniqueEmail: {
      username: 'user001',
      password: 'javascript',
      email: 'user002@mail.com',
      membershipLevel: 'regular',
    },

    // Object.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nonUniqueUsername: {
      username: 'user002',
      password: 'javascript',
      email: 'user005@mail.com',
      membershipLevel: 'regular'
    },
  },

  signIn: {
    // statuscode === 400
    // message === invalid credentials supplied 
    nullValues: {
    },
    
    // status code === 400
    // message === invalid credentials supplied
    nullUsername: {
      password: 'javascript'
    },

    nullPassword: {
      username: 'user001',
    },

    // status code === 200
    // message === user signin is successful
    fullSigninDetails: {
      username: 'user002',
      password: 'javascript'
    },

    // status code === 401
    // message === please verify the username or that you are registered
    wrongUsername: {
      username: 'user003',
      password: 'javascript'
    },

    // status code === 401
    // message === please verify the password is correct
    wrongPassword: {
      username: 'user002',
      password: 'javascript21'
    }
  }
};
