const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).send('okay');
});

router.use('/users', require('./users'));
router.use('/books', require('./books'));

module.exports = router;
