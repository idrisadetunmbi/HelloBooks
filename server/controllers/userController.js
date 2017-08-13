import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import models from '../models/';

import app from '../app';

const User = models.User;
const Book = models.Book;
const BorrowHistory = models.BorrowHistory;

dotenv.config({
  path: `${__dirname}/../../.env`
})

export default {
  // POST - /users/signup
  createUser(req, res) {
    bcrypt.hash(req.body.password, 10)
      .then(hashedPassword => User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        membershipLevel: req.body.membershipLevel,
        admin: req.body.admin
      })
        .then((user) => {
          user.password = undefined;
          res.status(201).send({
            user,
            message: 'user successfully created'
          });
        })
        .catch(error => res.status(400).send({
          message: 'username or email already exists',
          error: error.errors[0].message
        }))) // User.create catch
      .catch(error => res.status(400).send({
        error: error.message,
        message: 'No password supplied' // already caught by express validator
      })); // bcrypy.hash catch
  },

  // POST - /users/signin
  signInUser(req, res) {
    return User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then((user) => {
        if (user) {
          const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password);
          if (passwordIsCorrect) {
            const token = jwt.sign(user.id, process.env.AUTHENTICATION_SECRET);
            res.status(200).send({
              message: 'user signin is successful',
              token,
            });
          } else {
            res.status(401).send({
              message: 'please verify the password is correct'
            });
          }
        } else {
          res.status(401).send({
            message: 'please verify the username or that you are registered'
          });
        }
      })
      .catch(error => res.status(401).send({
        message: 'please verify your details are correct'
      })); // User.findOne catch
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
  // POST​ : /api/users/:userId:/books
  borrowBook(req, res) {
    const userId = req.user.identifier;
    const bookId = req.body.bookId;

    // if user making the request is not equal to the signed in user
    if (req.params.userId !== userId) {
      res.status(400).send({ message: 'bad request: unequal users' });
    } else {
      return User.findById(userId).then((result) => {
        if (!result) {
          res.status(400).send({
            result,
            message: 'unknown user id'
          });
        } else if (result.admin) {
          res.status(403).send({
            message: 'admin user cannot borrow a book'
          });
        } else {
          Book.findById(bookId).then((bookResult) => {
            if (!bookResult) {
              res.status(400).send({
                bookResult,
                message: 'unknown book id'
              });
            } else if (bookResult.quantity === 0) {
              res.status(200).send({
                result: 'there is not enough quantity of this book in the library'
              });
            } else {
              BorrowHistory.findOne({ // find if there is a record of this in the borrowHistory table
                where: {
                  userId,
                  bookId
                }
              }).then((borrowHistoryInstance) => {
                if (borrowHistoryInstance) { // if this history of borrowed book exists
                  if (borrowHistoryInstance.returnStatus) { // if book was previously borrowed but has been returned
                    // update borrow history instance setting returnStatus to false
                    borrowHistoryInstance.update({ returnStatus: false })
                      .then((updatedHistoryInstance) => {
                        bookResult.update({ // reduce available book quantity by one
                          quantity: bookResult.quantity - 1
                        });
                        res.status(200).send({
                          updatedHistoryInstance,
                          message: 'you have successfully borrowed this again'
                        });
                      }).catch(error => res.status(500).send({
                        error,
                        message: 'could not update this borrowing history'
                      }));
                  } else { // if user previously returned this book without returning it
                    res.status(200).send({
                      message: 'you had previously borrowed this book without returning it'
                    });
                  }
                } else {
                  BorrowHistory.create({ // create this borrow history
                    userId,
                    bookId
                  }).then((historyRecord) => {
                    bookResult.update({ // reduce available book quantity by one
                      quantity: bookResult.quantity - 1
                    });
                    res.status(201).send({
                      historyRecord,
                      message: 'you have successfully borrowed this book'
                    });
                  }).catch(error => res.send(error));
                }
              }).catch(error => res.send(error.message));
            }
          }).catch(error => res.send(error.message));
        }
      }).catch(error => res.send(error.message));
    }
  },
  // An API route that allow user to return a book
  // PUT : /api/users/<userId>/books
  returnBook(req, res) {
    const userId = req.user.identifier;
    const bookId = req.body.bookId;

    BorrowHistory.findOne({
      where: {
        userId,
        bookId
      }
    }).then((historyInstance) => {
      if (historyInstance.returnStatus) {
        res.send({
          message: 'you had previously returned this book'
        });
      } else {
        historyInstance.update({ returnStatus: true })
          .then((updatedHistoryInstance) => {
            Book.findById(bookId).then((bookInstance) => {
              bookInstance.update({ quantity: bookInstance.quantity + 1 });
            });
            res.status(201).send({
              updatedHistoryInstance,
              message: 'book has been returned successfully'
            });
          }).catch((error) => {
            res.status(500).send({
              message: error.message
            });
          });
      }
    }).catch((error) => {
      res.status(500).send({
        message: error.message
      });
    });
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
