const datasets = require('express').Router({ mergeParams: true });

const dataset = require('../controllers/datasets');

datasets.route('/')
  .get((req, res) => dataset.index(req, res, { attributes: ['id', 'name', 'title', 'episode', 'description', 'path', 'size'] }))
  .post(dataset.create);

datasets.route('/:did')
  .get((req, res) => dataset.show(req, res, { attributes: ['id', 'name', 'title', 'episode', 'description', 'path', 'size'] }))
  .delete(dataset.destroy);

datasets.route('/:did/images/:iid')
  .get(dataset.image);

datasets.route('/:did/query')
  .get(dataset.queries);

module.exports = datasets;
