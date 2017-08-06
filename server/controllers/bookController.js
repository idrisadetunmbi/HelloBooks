const Book = require('../models/').Book;

module.exports = {
  // POST - /users/signup
  addBook(req, res) {
    // Verify req details

    // Encrypt user password before storing
    return Book.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category
    })
      .then(book => res.status(200).send(book))
      .catch(error => res.status(400).send(error.message));
  },

  modifyBook(req, res) {
    res.status(200).send({
      message: 'NOT IMPLEMENTED: modify book route not implemented',
      reqid: req.params.bookId
    });
  },

  getAllBooks(req, res) {
    res.status(200).send({
      message: 'NOT IMPLEMENTED: get all books route not implemented'
    });
  }

};
