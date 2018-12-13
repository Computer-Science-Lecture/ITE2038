const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Order.findAll({
    where: assert.object(req.query),
    order: [['order_id', 'DESC']],
  },).then(r => res.json(r)),
  show: (req, res, query) => m.Order.findOne(Object.assign(
    assert.object(query), {
      where: { order_id: req.params.order_id },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Order.destroy({
    where: { order_id: req.params.order_id }
  }).then(r => res.json({status:'ok'})),
  create: (req, res) => {
    console.log(req.body);
    m.Order.create(req.body)
    .then(r => res.json(r.toJSON()))
  },
  update: (req, res) => {
    m.Order.update(req.body, {
      where: { order_id: req.params.order_id }
    }).then(result => {
      res.json({
        status: 'ok'
      });
    }).catch(e => res.json(e))
  },
};
