import models from '../models/';

const Book = models.Book;

export default {
  // POST - /api/books
  addBook(req, res) {
    return Book.create(req.body)
      .then((book) => {
        res.status(201).send({
          message: 'book added successfully',
          book
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: 'another book with this title exists',
          error: error.errors[0].message
        });
      });
  },

  // PUT - modify book - An API route that allow users to modify a book information
  // PUT​ : /api/books/<bookId>
  modifyBook(req, res) {
    return Book.findById(req.params.bookId)
      .then((bookInstance) => {
        if (bookInstance) {
          bookInstance.update(req.body)
            .then((book) => {
              res.status(200).send({
                message: 'book updated successfully',
                data: book
              });
            }).catch((error) => {
              res.status(400).send({ // should rarely happen
                message: 'another book with this title exists',
                error
              });
            });
        } else {
          res.status(400).send({
            error: 'book id does not exist',
          });
        }
      });
  },

  // GET - An API route that allow users to gets all the books in the library
  getAllBooks(req, res) {
    return Book.findAll()
      .then(result => res.status(200).send(result))
      .catch(error => res.send(error.message));
  }
};
