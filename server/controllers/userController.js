const User = require('../models/').User;
const BorrowHistory = require('../models/').BorrowHistory;
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
          .then((passwordIsCorrect) => {
            if (passwordIsCorrect) {
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
    BorrowHistory.findAll({
      where: {
        userId: req.params.userId,
        returnStatus: req.query.returned
      }
    }).then(results => res.status(200).send(results))
      .catch(error => res.status(500).send(error.message));
  },

  // An API route that allow a user to borrow a book
  // POST​ : /api/users/<userId>/books
  borrowBook(req, res) {
    const userId = req.params.userId;
    const bookId = req.body.bookId;

    BorrowHistory.findOne({ // find if there is a record of this in the borrowHistory table
      where: {
        userId: req.params.userId,
        bookId: req.body.bookId
      }
    }).then((borrowHistoryInstance) => {
      if (borrowHistoryInstance) { // if this history of borrowed book exists
        if (borrowHistoryInstance.returnStatus) { // if book was previously borrowed but has been returned
          // update borrow history instance setting returnStatus to false
          borrowHistoryInstance.update({ returnStatus: false })
            .then((updatedHistoryInstance) => {
              res.status(201).send(updatedHistoryInstance);
            }).catch(error => res.status(500).send({
              error,
              message: 'could not update this borrowing history'
            }));
        } else { // if user previously returned this book without returning it
          res.status(400).send({
            message: 'you had previously borrowed this book without returning it'
          });
        }
      } else {
        BorrowHistory.create({ // create this borrow history
          userId,
          bookId
        }).then(historyRecord => res.status(201).send({
          historyRecord,
          message: 'you have successfully borrowed this book'
        }))
          .catch(error => res.send(error));
      }
    }).catch(error => res.send(error.message));
  },

  // An API route that allow user to return a book
  // PUT​ : /api/users/<userId>/books
  returnBook(req, res) {
    BorrowHistory.findOne({
      where: {
        userId: req.params.userId,
        bookId: req.body.bookId
      }
    }).then((historyInstance) => {
      historyInstance.update({ returnStatus: true })
        .then((updatedHistoryInstance) => {
          res.status(201).send({
            updatedHistoryInstance,
            message: 'book has been returned successfully'
          });
        }).catch(error => res.status(500).send({
          error,
          message: 'could not update this borrowing history'
        }));
    }).catch(error => res.status(500).send({
      message: 'could not retrieve book details',
      error
    }));
  },

  // Personal route
  getAllUsers(req, res) {
    return User.findAll().then(users => res.send(users));
  },
  // Personal route
  getUser(req, res) {
    return User.findById(req.params.userId).then(user => res.send(user));
  }

};
