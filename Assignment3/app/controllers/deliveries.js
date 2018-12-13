const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Delivery.findAll({
    where: assert.object(req.query),
    raw: true,
  }).then(r => Promise.all(r.map(delivery => (
    new Promise((res, rej) => (
      m.Order.count({
        where: { delivery_id: delivery.delivery_id }
      }).then(c => res(Object.assign({
        stack: c,
      }, delivery)))
    ))))).then(deliveries => res.json(deliveries))),
};
