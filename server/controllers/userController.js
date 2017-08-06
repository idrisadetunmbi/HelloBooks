const User = require('../models/').User;

module.exports = {
  // POST - /users/signup
  createUser(req, res) {
    // Verify req details

    // Encrypt user password before storing
    return User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    })
      .then(user => res.status(200).send(user.username))
      .catch(error => res.status(400).send(error.message));
    /* let body = {
      username: req.body.username,
      password: req.body.password,
      free: req.query.free,
      message: 'create user route not yet implemented'
    };

    res.status(200).send(body);
    */
  },

  // POST - /users/signin
  signInUser(req, res) {
    /*
      let username = req.body.username,
      password = req.body.password;
    */
    return User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error.message));
  },

  // An API route that allow users to get all the books that the user has
  // borrowed but has not returned 
  // GET​ - /api/users/:userId/books?returned=false
  getBorrowedBooks(req, res) {
    const body = {
      userId: req.params.userId,
      message: 'NOT IMPLEMENTED: An API route that allow users to get all the books that the user has borrowed but has not returned'
    };
    if (req.query.returned !== null) {
      body.returned = req.query.returned;
    }

    res.status(200).send(body);
  },

  // An API route that allow a user to borrow a book
  // POST​ : /api/users/<userId>/books
  borrowBook(req, res) {
    res.status(200).send({
      userId: req.params.userId,
      message: 'NOT IMPLEMENTED: An API route that allow a user to borrow a book'
    });
  },

  // An API route that allow user to return a book
  // PUT​ : /api/users/<userId>/books
  returnBook(req, res) {
    res.status(200).send({
      userId: req.params.userId,
      message: 'NOT IMPLEMENTED: An API route that allow user to return a book'
    });
  }

};
