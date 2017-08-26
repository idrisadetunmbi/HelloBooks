import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import models from '../models/';

const User = models.User;
const Book = models.Book;
const BorrowHistory = models.BorrowHistory;

dotenv.config({
  path: `${__dirname}/../../.env`
});

export default {
  // POST - /users/signup
  createUser(req, res) {
    bcrypt.hash(req.body.password, 10)
      .then(hashedPassword => User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        membershipLevel: req.body.membershipLevel
      })
        .then((user) => {
          user.password = undefined;
          res.status(201).send({
            message: 'user successfully created',
            data: user
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
              data: { token, userId: user.id }
            });
          } else {
            res.status(401).send({
              message: 'please verify the password is correct'
            });
          }
        } else {
          res.status(401).send({
            message: 'username does not exist'
          });
        }
      })
      .catch(error => res.status(401).send({
        message: 'please verify your details are correct',
        error
      })); // User.findOne catch
  },

  // An API route that allow users to get all the books that the user has
  // borrowed but has not returned 
  // GET​ - /api/users/:userId/books?returned=false
  getBorrowedBooks(req, res) {
    const returned = req.query.returned === 'false';
    if (returned) {
      BorrowHistory.findAll({
        where: {
          userId: req.params.userId,
          returnStatus: false
        }
      }).then((results) => {
        res.status(200).send({
          message: 'list of user unreturned books',
          data: results
        });
      })
        .catch(error => res.status(500).send({ error: error.message }));
    } else {
      BorrowHistory.findAll({
        where: {
          userId: req.params.userId,
        }
      }).then(results => res.status(200).send({
        message: 'list of user borrowd books',
        data: results
      }))
        .catch(error => res.status(500).send({ error: error.message }));
    }
  },

  // An API route that allow a user to borrow a book
  // POST​ : /api/users/:userId/books
  borrowBook(req, res, next) {
    const userId = req.user;
    const bookId = req.body.bookId;
    // if user making the request is not equal to the signed in user
    Book.findById(bookId).then((bookInstance) => {
      if (bookInstance.quantity === 0) {
        res.status(400).send({
          message: 'there is not enough quantity of this book in the library'
        });
      } else {
        BorrowHistory.findOne({
          where: {
            userId,
            bookId
          }
        }).then((borrowHistoryInstance) => {
          if (borrowHistoryInstance) {
            if (!borrowHistoryInstance.returnStatus) { // if user had previously borrowed this book without returning it
              res.status(403).send({
                message: 'you had previously borrowed this book without returning it'
              });
            } else {
              req.instanceAvailable = true;
              next();
            }
          } else {
            next();
          }
        }).catch((error) => { // should rarely happen
          res.status(500).send({
            error
          });
        });
      }
    }).catch((error) => { // should rarely happen
      res.status(500).send({
        error
      });
    });
  },
  // An API route that allow user to return a book
  // PUT : /api/users/<userId>/books

  borrowBookAllowed(req, res) {
    const bookId = req.body.bookId;

    Book.findById(bookId).then((bookInstance) => {
      Book.update({
        quantity: bookInstance.quantity - 1
      }, {
        where: {
          id: bookId
        }
      }).then(() => {
        if (req.instanceAvailable) {
          BorrowHistory.update({ returnStatus: false }, {
            where: { userId: req.user, bookId: req.body.bookId }
          }).then(() => {
            res.status(201).send({
              message: 'you have successfully borrowed this book again',
              data: bookInstance
            });
          }).catch((error) => {
            res.status(500).send({
              message: 'could not complete this request',
              error: error.message
            });
          });
        } else {
          BorrowHistory.create({
            userId: req.user,
            bookId: req.body.bookId
          }).then(() => {
            res.status(201).send({
              message: 'you have successfully borrowed this book',
              data: bookInstance
            });
          }).catch((error) => {
            res.status(400).send({
              message: 'could not complete this request',
              error: error.message
            });
          });
        }
      }).catch((error) => {
        res.status(500).send({
          message: 'could not update this book instance',
          error: error.message
        });
      });
    }).catch((error) => {
      res.status(500).send({
        message: 'could not retrieve this book instance',
        error: error.message
      });
    });
  },

  returnBook(req, res) {
    const userId = req.user;
    const bookId = req.body.bookId;

    BorrowHistory.findOne({
      where: {
        userId,
        bookId
      }
    }).then((historyInstance) => {
      if (historyInstance) {
        if (historyInstance.returnStatus) {
          res.status(400).send({
            message: 'you had previously returned this book'
          });
        } else {
          historyInstance.update({ returnStatus: true })
            .then((updatedHistoryInstance) => {
              Book.findById(bookId).then((bookInstance) => {
                bookInstance
                  .update({ quantity: bookInstance.quantity + 1 })
                  .then(() => {
                    res.status(201).send({
                      message: 'book has been returned successfully',
                      data: updatedHistoryInstance
                    });
                  }).catch(error => res.status(500).send({
                    error: error.message
                  }));
              });
            }).catch((error) => {
              res.status(400).send({
                message: error.message
              });
            });
        }
      } else {
        res.status(400).send({
          message: 'there is no instance of this borrowed book relationship'
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
