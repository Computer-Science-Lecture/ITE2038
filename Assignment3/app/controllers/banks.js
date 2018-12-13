const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Bank.findAll({
    where: assert.object(req.query),
  },).then(r => res.json(r)),
};
