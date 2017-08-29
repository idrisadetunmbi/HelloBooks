import express from 'express';

import userRouter from './users';
import bookRouter from './books';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('okay');
});

router.use('/users', userRouter.router);
router.use('/books', bookRouter.router);

export default router;
