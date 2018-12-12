const m = require('../models');
const { assert } = require('../lib');

module.exports = {
  index: (req, res, query) => m.Submission.findAll(
    Object.assign(assert.object(query), {
      where: assert.param(
        Object.assign(req.params, assert.object(req.query)), {
          qid: 'QueryId',
          did: 'DatasetId',
          author: 'author',
        },
      ),
    }, 'limit' in req.params ? {
      order: [['id', 'DESC']],
      limit: parseInt(req.params.limit, 10),
    }: {}),
  ).then(r => res.json(r)),
  show: (req, res, query) => m.Submission.findOne(
    Object.assign(assert.object(query), {
      where: assert.param(req.params, {
        qid: 'QueryId',
        did: 'DatasetId',
        sid: 'id',
      }),
      raw: true,
    }),
  ).then(r => assert.result(res, r, (resolve, result) => m.Annotation.findAll({
    attributes: ['index', 'data', 'position'],
    where: { SubmissionId: req.params.sid },
  }).then((annotations) => {
    result.annotations = annotations;
    result.annotations.forEach(a => a.position = a.position.split(',').map(parseFloat));
    resolve.json(result);
  }))),
  destroy: (req, res) => m.Submission.destroy({
    where: { id: req.params.sid },
  }).then(r => res.json(r.toJSON())),
  create: (req, res) => m.Submission.create(
    Object.assign(req.body, {
      ip: assert.ip(req),
    }, req.body.meta),
  ).then((r) => {
    req.body.annotations.forEach((annos, i) => annos.forEach(a => r.createAnnotation({
      position: a.position.map(result => result.toFixed(4)).join(','),
      index: i,
      data: a.data,
    })));
    res.json(r.toJSON());
  }),
  annotations: (req, res) => m.Submission.findAll({
    where: assert.param(req.params, {
      qid: 'QueryId',
      did: 'DatasetId',
      sid: 'id',
    }),
  }).then(async r => res.json(await Promise.all(
    r.map(s => s.getAnnotations({ attributes: ['index', 'data', 'position'] })
      .map(a => a.get({ plain: true }))),
  ))),
  authors: (req, res) => m.Submission.findAll({
    attributes: [[m.Sequelize.fn('DISTINCT', m.Sequelize.col('author')), 'author']]
  }).then(r => res.json(r.map(e => e.author))),
};
