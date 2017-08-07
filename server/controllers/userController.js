const User = require('../models/').User;
const bcrypt = require('bcrypt');

module.exports = {
  // POST - /users/signup
  createUser(req, res) {
    bcrypt.hash(req.body.password, 10)
      .then(hashedPassword => User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        membershipLevel: req.body.membershipLevel
      })
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error.message)));
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
      .then((user) => {
        bcrypt.compare(req.body.password, user.password)
          .then((result) => {
            if (result) {
              res.status(200).send({ message: 'user sign in is successful', user });
            } else {
              res.status(400).send('Authentication failed: wrong password');
            }
          });
      })
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