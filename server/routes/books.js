import express from 'express';

import bookController from '../controllers/bookController';

const router = express.Router();

// POST - add book - An API route that allow users add new book
router.post('/', bookController.addBook);

// PUT - modify book - An API route that allow users to modify a book information
router.put('/:bookId', bookController.modifyBook);

// GET - An API route that allow users to gets all the books in the library
router.get('/', bookController.getAllBooks);

export default { router };
