const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Submission.findOne({
    where: assert.param(req.params, {
      qid: 'QueryId',
      did: 'DatasetId',
      sid: 'id',
    }),
  }).then(r => assert.result(res, r, (resolve, result) => {
    result.getAnnotations(Object.assign(assert.object(query), {
      where: { SubmissionId: req.params.sid },
    })).then(extracted => resolve.json(extracted));
  })),
  show: (req, res, query) => m.Submission.findOne({
    where: assert.param(req.params, {
      qid: 'QueryId',
      did: 'DatasetId',
    }),
  }).then(r => assert.result(res, r, (resolve, result) => {
    result.getAnnotations(Object.assign(assert.object(query), {
      where: {
        id: req.params.aid,
        SubmissionId: req.params.sid,
      },
    })).then(extracted => resolve.json(extracted));
  })),
  destroy: (req, res) => m.Annotation.destroy({ where: { id: req.params.aid } })
    .then(r => res.json(r.toJSON())),
  create: (req, res) => m.Annotation.create(req.body)
    .then(r => res.json(r.toJSON())),
};
