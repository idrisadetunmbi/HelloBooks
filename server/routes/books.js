import express from 'express';

import bookController from '../controllers/bookController';
import requestValidators from '../controllers/requestValidators';

const router = express.Router();

// POST - add book - An API route that allow an admin user add a new book
router.post('/', requestValidators.adminValidation,
  requestValidators.createBookRequest,
  bookController.addBook);

// PUT - modify book - An API route that allow users to modify a book information
router.put('/:bookId', requestValidators.adminValidation,
  requestValidators.modifyBookRequest,
  bookController.modifyBook);

// GET - An API route that allow users to gets all the books in the library
router.get('/', bookController.getAllBooks);

export default { router };
