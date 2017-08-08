import express from 'express';

import logger from 'morgan';

import bodyParser from 'body-parser';

import api from './routes/api';

const app = express();

// Log request to the console
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

export default app;
