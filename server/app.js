import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import expressJWT from 'express-jwt';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';

import api from './routes/api';

dotenv.config({
  path: `${__dirname}/../.env`
});

const app = express();

// Log request to the console
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator({
  customValidators: {
    isAlphaNum: value => /^[0-9a-zA-Z]+$/.test(value),

    // verifies if value from req is in the specified memebership level
    inMembershipLevels: value => ['regular', 'silver', 'gold', 'platinum'].includes(value),

    isPositive: value => value >= 0
  }
}));

app.use(expressJWT({ secret: process.env.AUTHENTICATION_SECRET }).unless({
  path: ['/', '/api/users/signup', '/api/users/signin', '/api/', '/api/users']
}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      error: 'you are not signed in or invalid token'
    });
  } else {
    next();
  }
});

app.use('/api', api);

export default app;
