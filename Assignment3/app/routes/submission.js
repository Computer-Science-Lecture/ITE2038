const submissions = require('express').Router({ mergeParams: true });

const submission = require('../controllers/submissions');


submissions.route('/')
  .get((req, res) => submission.index(req, res))
  .post(submission.create);

submissions.route('/authors')
  .get(submission.authors);

submissions.route('/annotations')
  .get(submission.annotations);

submissions.route('/:sid')
  .get((req, res) => submission.show(req, res))
  .delete(submission.destroy);

submissions.associate = (r) => {
  r.router.use('/submission', submissions);
  r.dataset.use('/:did/submission', submissions);
  r.query.use('/:qid/submission', submissions);
};

module.exports = submissions;
