const stores = require('express').Router({ mergeParams: true });

const store = require('../controllers/stores');

stores.route('/')
  .get(store.index);

stores.route('/:store_id')
  .get(store.show);

module.exports = stores;
