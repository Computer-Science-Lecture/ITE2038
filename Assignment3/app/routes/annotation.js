const annotations = require('express').Router({ mergeParams: true });

const annotation = require('../controllers/annotations');

annotations.route('/')
  .get((req, res) => annotation.index(req, res, { attributes: ['position', 'data', 'index'] }))
  .post(annotation.create);

annotations.route('/:aid')
  .get((req, res) => annotation.show(req, res, { attributes: ['position', 'data', 'index'] }))
  .delete(annotation.destroy);

annotations.associate = (r) => {
  r.submission.use('/:sid/annotation', annotations);
};

module.exports = annotations;
