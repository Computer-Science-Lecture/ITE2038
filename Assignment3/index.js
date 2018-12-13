const express = require('express');
const session = require('express-session');
const parser = require('body-parser');

const lib = require('./app/lib');
const models = require('./app/models');

const app = express();

lib.io.writeSync('secret', secretString = lib.io.hash());

app.use(session({
  secret: secretString,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 86400000,
  }
}));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/site'));

app.use('/', require('./app/routes/index'));

models.sequelize.sync().then(() => (
  app.listen(80, () => (
    console.log('(http ) listening on ', 80)
  ))
));
