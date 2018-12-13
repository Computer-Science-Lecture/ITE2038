const destinations = require('express').Router({ mergeParams: true });

const destination = require('../controllers/destinations');

destinations.route('/')
  .get(destination.index)
  .post(destination.create);

destinations.route('/:destination_id')
  .get(destination.show)
  .put(destination.update)
  .delete(destination.destroy);

module.exports = destinations;
