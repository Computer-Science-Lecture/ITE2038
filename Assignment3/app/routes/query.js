const queries = require('express').Router({ mergeParams: true });

const query = require('../controllers/queries');

queries.route('/')
  .get((req, res) => query.index(req, res, { attributes: ['id', 'alert', 'name', 'data'] }))
  .post(query.create);

queries.route('/types')
  .get(query.types);

queries.route('/:qid')
  .get((req, res) => query.show(req, res, { attributes: ['id', 'alert', 'name', 'data'] }))
  .delete(query.destroy);

queries.route('/:qid/dataset')
  .get(query.datasets);

module.exports = queries;
