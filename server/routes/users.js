import express from 'express';
import userController from '../controllers/userController';
import reqValidators from '../controllers/requestValidators';

const router = express.Router();

router.post('/signup', reqValidators.signUpRequest, userController.createUser);

router.post('/signin', reqValidators.signInRequest, userController.signInUser);

// An API route that allow a user to borrow a book
// POST​ : /api/users/<userId>/books
router.post('/:userId/books', reqValidators.userBookActions,
  userController.borrowBook,
  userController.borrowBookAllowed);

// An API route that allow user to return a book
// PUT​ : /api/users/<userId>/books
router.put('/:userId/books', reqValidators.userBookActions, userController.returnBook);

// An API route that allow users to get all the books that the user has
// borrowed but has not returned
// GET​ - /api/users/<userId>/books?returned=false
router.get('/:userId/books', reqValidators.getUserBorrowedBooks, userController.getBorrowedBooks);

// Personal route - get all users
router.get('/', userController.getAllUsers);

router.get('/:userId', userController.getUser);

export default { router };
