const fetches = require('express').Router({ mergeParams: true });

const fetch = require('../controllers/fetch');

fetches.route('/')
  .get(fetch.request);

module.exports = fetches;
