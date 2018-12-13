const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Menu.findAll({
    where: assert.object(req.query),
  },).then(r => res.json(r)),
  show: (req, res, query) => m.Menu.findOne(Object.assign(
    assert.object(query), {
      where: { menu_id: req.params.menu_id },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Menu.destroy({ where: { menu_id: req.params.menu_id } })
    .then(r => res.json({status:'ok'})),
  create: (req, res) => m.Menu.create(req.body)
    .then(r => res.json(r.toJSON())),
};
