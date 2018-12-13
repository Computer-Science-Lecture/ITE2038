const deliveries = require('express').Router({ mergeParams: true });

const delivery = require('../controllers/deliveries');

deliveries.route('/')
  .get(delivery.index);

module.exports = deliveries;
