const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Seller.findAll(assert.object(query))
    .then(r => res.json(r)),
  show: (req, res, query) => m.Seller.findOne(Object.assign(
    assert.object(query), {
      where: { seller_id: req.params.seller_id },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Seller.destroy({ where: { id: req.params.seller_id } })
    .then(r => res.json(r.toJSON())),
  create: (req, res) => m.Seller.create(req.body)
    .then(r => res.json(r.toJSON())),
  update: (req, res) => {
    m.Seller.update({
      name: req.body.name,
      passwd: req.body.passwd,
    }, {
      where: {
        seller_id: req.params.seller_id
      }
    }).then(result => {
      res.json({
        status: 'ok'
      });
    }).catch(e => res.json(e))
  },
};
