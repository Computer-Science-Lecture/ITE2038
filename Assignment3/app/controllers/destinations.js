const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Destination.findAll({
    where: assert.object(req.query),
  },).then(r => res.json(r)),
  show: (req, res, query) => m.Destination.findOne(Object.assign(
    assert.object(query), {
      where: { destination_id: req.params.destination_id },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Destination.destroy({
    where: { destination_id: req.params.destination_id }
  }).then(r => res.json({status:'ok'})),
  create: (req, res) => m.Destination.create(req.body)
    .then(r => res.json(r.toJSON())),
  update: (req, res) => {
    m.Destination.update(req.body, {
      where: { destination_id: req.params.destination_id }
    }).then(result => {
      res.json({
        status: 'ok'
      });
    }).catch(e => res.json(e))
  },
};
