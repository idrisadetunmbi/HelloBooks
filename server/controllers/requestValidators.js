import models from '../models';

const User = models.User;
const Book = models.Book;

export default {
  signUpRequest: (req, res, next) => {
    req.checkBody('username', 'username can only be 6 to 15 alphanumeric characters').notEmpty().len(6, 15).isAlphaNum();
    req.checkBody('password', 'password can\'t be less than 6 characters').notEmpty().len(6, 20);
    req.checkBody('email', 'invalid email address').notEmpty().isEmail();
    req.checkBody('membershipLevel',
      'membership level can only be in [regular, silver, gold, platinum]').inMembershipLevels();

    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        const errorArray = errors.useFirstErrorOnly().array();

        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        next();
      }
    });
  },

  signInRequest: (req, res, next) => {
    req.checkBody('username', 'username can only be 6 to 15 alphanumeric characters').notEmpty().len(6, 15).isAlphaNum();
    req.checkBody('password', 'password can\'t be less than 6 characters').notEmpty().len(6, 20);
    
    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        const errorArray = errors.useFirstErrorOnly().array();

        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        next();
      }
    });
  },

  createBookRequest: (req, res, next) => {
    req.checkBody('title', 'title cannot be less than 5 characters').notEmpty().len(5, 50);
    req.checkBody('author', 'author cannot be empty').notEmpty();
    req.checkBody('quantity', 'quantity can only be a positive integer').notEmpty().isInt().isPositive();
    req.checkBody('description', 'description cannot be less than 5 characters').notEmpty().len(5, 1000);
    req.checkBody('category', 'category cannot be less than 3 characters').notEmpty().len(5, 20);
    // TODO: Use sanitization
    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        const errorArray = errors.useFirstErrorOnly().array();

        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        next();
      }
    });
  },

  modifyBookRequest: (req, res, next) => {
    req.checkParams('bookId', 'invalid bookId param').isInt().isPositive();
    const reqBodyParams = Object.keys(req.body);
    if (!reqBodyParams.some(value => // if request body does not include any of the book columns
      ['title', 'description', 'author', 'quantity', 'category'].includes(value))) {
      res.status(200).send({
        message: 'no modifications requested'
      });
      return;
    }

    if (reqBodyParams.includes('title')) {
      req.checkBody('title', 'title cannot be less than 5 characters').notEmpty().len(5, 50);
    }
    if (reqBodyParams.includes('author')) {
      req.checkBody('author', 'author cannot be empty').notEmpty();
    }
    if (reqBodyParams.includes('quantity')) {
      req.checkBody('quantity', 'quantity can only be a positive integer').notEmpty().isInt().isPositive();
    }
    if (reqBodyParams.includes('description')) {
      req.checkBody('description', 'description cannot be less than 5 characters').notEmpty().len(5, 1000);
    }
    if (reqBodyParams.includes('category')) {
      req.checkBody('category', 'category cannot be less than 3 characters').notEmpty().len(5, 20);
    }

    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        const errorArray = errors.useFirstErrorOnly().array();
        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        next();
      }
    });
  },

  adminValidation: (req, res, next) => {
    if (!req.user.isAdmin) {
      res.status(403).send({
        error: 'you are not allowed to perform this operation'
      });
      return;
    }
    next();
  },

  userBookActions: (req, res, next) => {
    if (req.user.userId !== req.params.userId) {
      res.status(403).send({
        message: 'signed in user is not equal to requesting user',
        description: 'you cannot perform this function for another user'
      });
      return;
    }

    if (req.user.isAdmin) {
      res.status(403).send({
        message: 'admin user cannot perform this function'
      });
      return;
    }

    return Book.findById(req.body.bookId)
      .then((book) => {
        if (!book) {
          res.status(400).send({
            message: 'there is no book with the specified id'
          });
        } else {
          next();
        }
      }).catch((error) => {
        res.status(500).send({
          error: error.message
        });
      });
  },

  getUserBorrowedBooks: (req, res, next) => {
    if (req.user.isAdmin) {
      User.findById(req.params.userId)
        .then((result) => {
          if (!result) {
            res.status(400).send({
              message: 'user does not exist'
            });
            return;
          }
          next();
        })
        .catch((error) => {
          res.status(400).send({
            message: 'invalid user Id',
            description: error.message
          });
        });
    } else if (req.user.userId !== req.params.userId) {
      res.status(400).send({
        message: 'signed in user is not equal to requesting user'
      });
    } else {
      next();
    }
  }
};
