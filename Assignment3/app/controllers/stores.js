const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Store.findAll({
    where: assert.object(req.query),
  },).then(r => res.json(r)),
  show: (req, res, query) => m.Store.findOne(Object.assign(
    assert.object(query), {
      where: { store_id: req.params.store_id },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Store.destroy({ where: { id: req.params.store_id } })
    .then(r => res.json(r.toJSON())),
  create: (req, res) => m.Store.create(req.body)
    .then(r => res.json(r.toJSON())),
};
