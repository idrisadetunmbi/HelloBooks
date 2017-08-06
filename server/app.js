const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Log request to the console
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', require('./routes/api'));

module.exports = app;
