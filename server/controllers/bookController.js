import models from '../models/';

const Book = models.Book;

export default {
  // POST - /api/books
  addBook(req, res) {
    return Book.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
      quantity: req.body.quantity
    })
      .then(book => res.status(201).send(book))
      .catch(error => res.status(400).send(error.message));
  },

  // PUT - modify book - An API route that allow users to modify a book information
  // PUT​ : /api/books/<bookId>
  modifyBook(req, res) {
    return Book.findById(req.params.bookId).then((bookInstance) => {
      bookInstance.update(req.body).then((book) => {
        res.status(200).send({
          book,
          message: 'book updated successfuly'
        });
      }).catch(error => res.send(error.message)); // bookInstance.update
    }).catch(error => res.send(error.message)); // Book.findById
  },

  // GET - An API route that allow users to gets all the books in the library
  getAllBooks(req, res) {
    return Book.findAll()
      .then(result => res.status(200).send(result))
      .catch(error => res.send(error.message));
  }
};
