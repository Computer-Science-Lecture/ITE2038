const sellers = require('express').Router({ mergeParams: true });

const seller = require('../controllers/sellers');

sellers.route('/')
  .get(seller.index)
  .post(seller.create);

sellers.route('/:seller_id')
  .put(seller.update)
  .get(seller.show)
  .delete(seller.destroy);

module.exports = sellers;
