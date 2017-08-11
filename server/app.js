import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import expressJWT from 'express-jwt';

import api from './routes/api';

const app = express();

// Log request to the console
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('authenticationSecret', '1234');
app.use(expressJWT({ secret: app.get('authenticationSecret') }).unless({
  path: ['/api/users/signup', '/api/users/signin', '/api', '/api/books', '/api/users']
}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

/*
  app.get('/', (req, res) => {
  res.status(200).send('Welcome');
});*/

app.use('/api', api);

export default app;
