const orders = require('express').Router({ mergeParams: true });

const order = require('../controllers/orders');

orders.route('/')
  .get(order.index)
  .post(order.create);

orders.route('/:order_id')
  .get(order.show)
  .put(order.update)
  .delete(order.destroy);

module.exports = orders;
