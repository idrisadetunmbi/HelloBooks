const router = require('express').Router();

const userController = require('../controllers/userController');

router.post('/signup', userController.createUser);

router.post('/signin', userController.signInUser);

// An API route that allow users to get all the books that the user has
// borrowed but has not returned
// GET​ - /api/users/<userId>/books?returned=false
router.get('/:userId/books', userController.getBorrowedBooks);

// An API route that allow a user to borrow a book
// POST​ : /api/users/<userId>/books
router.post('/:userId/books', userController.borrowBook);

// An API route that allow user to return a book
// PUT​ : /api/users/<userId>/books
router.put('/:userId/books', userController.returnBook);

// Personal route - get all users
router.get('/', userController.getAllUsers);

router.get('/:userId', userController.getUser);


module.exports = router;
