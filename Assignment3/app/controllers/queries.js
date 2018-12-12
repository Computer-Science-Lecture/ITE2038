const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Query.findAll(assert.object(query))
    .then(r => res.json(r)),
  show: (req, res, query) => m.Query.findOne(Object.assign(
    assert.object(query), {
      where: { id: req.params.qid },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Query.destroy({ where: { id: req.params.qid } })
    .then(r => res.json(r.toJSON())),
  create: (req, res) => m.Query.create(req.body)
    .then(r => res.json(r.toJSON())),
  datasets: (req, res) => m.DatasetQuery.findAll({
    where: { QueryId: req.params.qid },
  }).then(r => assert.result(res, r)),
  types: (req, res) => res.json(['none', 'tag']),
};
