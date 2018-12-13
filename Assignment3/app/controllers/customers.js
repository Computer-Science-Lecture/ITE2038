const m = require('../models');
const { assert } = require('../lib');

module.exports = {
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
