import models from '../models/';

const Book = models.Book;
const User = models.User;

export default {
  // POST - /api/books
  addBook(req, res) {
    const userId = req.user.identifier;
    return User.findById(userId).then((user) => {
      if (!user.admin) {
        res.send({
          message: 'you are not authorized to perform this function'
        });
      } else {
        Book.create(req.body)
          .then((book) => {
            res.status(201).send(book);
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
      }
    }).catch((error => error.message));
  },

  // PUT - modify book - An API route that allow users to modify a book information
  // PUT​ : /api/books/<bookId>
  modifyBook(req, res) {
    const userId = req.user.identifier;

    User.findById(userId).then((user) => {
      if (!user.admin) {
        res.status(403).send({
          message: 'you are not authorized to perform this function'
        });
      } else {
        Book.findById(req.params.bookId).then((bookInstance) => {
          bookInstance.update(req.body).then((book) => {
            res.status(200).send({
              book,
              message: 'book updated successfuly'
            });
          }).catch(error => res.send(error.message)); // bookInstance.update
        }).catch(error => res.send(error.message)); // Book.findById
      }
    }).catch((err) => {
      res.status(500).send(err.message);
    });
  },

  // GET - An API route that allow users to gets all the books in the library
  getAllBooks(req, res) {
    return Book.findAll()
      .then(result => res.status(200).send(result))
      .catch(error => res.send(error.message));
  }
};
