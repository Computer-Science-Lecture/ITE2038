const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Customer.findAll({
    where: assert.object(req.query),
  },).then(r => res.json(r)),
  update: (req, res) => {
    m.Customer.update(req.body, {
      where: { customer_id: req.params.customer_id }
    }).then(result => {
      res.json({
        status: 'ok'
      });
    }).catch(e => res.json(e))
  },
};
