const customers = require('express').Router({ mergeParams: true });

const customer = require('../controllers/customers');

customers.route('/')
  .get(customer.index);

customers.route('/:customer_id/payment')
  .put(customer.update);

module.exports = customers;
