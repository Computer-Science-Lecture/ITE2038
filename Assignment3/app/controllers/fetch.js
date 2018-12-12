const m = require('../models');

module.exports = {
  /**
   * Fetch.request provide DatasetId, QueryId
   * You can fix DatasetId or QueryId using {req.query} as below
   * // "/fetch?dataset=1,2,3&query=3"
   * Or, select automatically with the smallest submissions and smallest requested.
   */
  request: async (req, res) => {
    // Select DatasetQueries with requested query or actived
    const quest = Object.assign(
      'dataset' in req.query && req.query.dataset ? {
        DatasetId: {
          $in: req.query.dataset.split(',').map(i => parseInt(i, 10)),
        },
      } : {},
      'query' in req.query && req.query.query ? {
        QueryId: {
          $in: req.query.query.split(',').map(i => parseInt(i, 10)),
        },
      } : {}
    );

    m.DatasetQuery.findAll({
      where: Object.keys(quest).length ? quest : { active: true },
    }).then(dqs => Promise.all(
      dqs.map(async dq => [
        dq.DatasetId,
        dq.QueryId,
        dq.request,
        (await m.Submission.count({
          where: {
            DatasetId: dq.DatasetId,
            QueryId: dq.QueryId,
          },
        })),
      ]),
    ).then((candidates) => {
      const minimum = Math.min(...candidates.map(x => x[3]));
      const [did, qid] = candidates.filter(x => x[3] === minimum)
        .sort((r, l) => r[2] - l[2])
        .shift() || [];

      m.DatasetQuery.update({
        request: m.sequelize.literal('request+1'),
      }, {
        where: {
          DatasetId: did,
          QueryId: qid,
        },
      }).then(async () => res.json(
        Object.assign(
          await m.DatasetQuery.findOne({
            where: {
              DatasetId: did,
              QueryId: qid,
            },
            raw: true,
          }), {
            dataset: await m.Dataset.findOne({
              where: { id: did },
            }),
            query: await m.Query.findOne({
              where: { id: qid },
            }),
          },
        ),
      ));
    }));
  },

  /**
   * Fetch.export server annotation data as json format
   * set specific {did} and {query} to download
   * // "/export/{3}"
   * // "/export/{3}/query={1,2,3}"
   */
  export: (req, res) => Promise.all([
    m.DatasetQuery.findAll({
      attributes: [[m.Sequelize.fn('DISTINCT', m.Sequelize.col('QueryId')), 'QueryId']],
      where: Object.assign(
        'query' in req.query && req.query.query ? {
          QueryId: {
            $in: req.query.query.split(',').map(i => parseInt(i, 10)),
          },
        } : {}, {
          DatasetId: req.params.did,
        },
      ),
    }),
    m.Dataset.findOne({
      where: { id: req.params.did },
    }),
  ]).then(([qs, dataset]) => {
    Promise.all(qs.map(query => new Promise(resolve => m.Query.findOne({
      where: { id: query.QueryId },
    }).then(q => resolve(q))))).then(queries => (
      Promise.all(queries.map(async query => m.Submission.findAll({
        limit: 1,
        order: [['id', 'DESC']],
        where: {
          DatasetId: dataset.id,
          QueryId: query.id,
        },
      }))).then(submissions => (
        Promise.all(submissions.map(submission => (
          new Promise(resolve => (submission.length ? submission[0].getAnnotations({
            attributes: ['index', 'position', 'data', 'SubmissionId'],
            raw: true,
          }).then(annotations => resolve(annotations)) : resolve([])))
        ))).then((annotations) => {
          res.json(Object.assign({
            dataset,
            queries,
            bounding_boxes: [...Array(queries.length).keys()].map(i => (
              annotations[i].map(a => Object.assign(a, {
                position: a.position.split(',').map(x => parseInt(x, 10)),
                type: queries[i].id,
              })).filter(a => ('iid' in req.params ? a.index === parseInt(req.params.iid, 10) : true))
            )).flat(),
          }, 'iid' in req.params ? {
            images: {
              index: parseInt(req.params.iid, 10),
            },
          } : {}));
        })
      ))
    ));
  }),

  /**
   * Fetch.indexRelation show all relations
   */
  indexRelation: (req, res) => m.DatasetQuery.findAll().then(r => res.json(r)),

  /**
   * Fetch.createRelation create spcific relation
   * between {dataset} and {query}
   */
  createRelation: (req, res) => {
    if ('dataset' in req.query && 'query' in req.query) {
      Promise.all([
        m.Dataset.findAll({
          where: {
            id: { $in: req.query.dataset.split(',').map(i => parseInt(i, 10)) },
          },
        }),
        m.Query.findAll({
          where: {
            id: { $in: req.query.query.split(',').map(i => parseInt(i, 10)) },
          },
        })
      ]).then(([ds, qs]) => {
        for (let d of ds) {
          for (let q of qs) {
            d.addQuery(q);
          }
        }
        res.send('Done');
      }).catch(e => res.status(500).send({ error: e }))
    } else {
      res.status(400).send({ error: 'Select both dataset and query' });
    }
  },

  /**
   * Fetch.deleteRelation delete relation
   */
  deleteRelation: (req, res) => {
    if ('dataset' in req.query && 'query' in req.query) {
      Promise.all([
        m.Dataset.findAll({
          where: {
            id: { $in: req.query.dataset.split(',').map(i => parseInt(i, 10)) },
          },
        }),
        m.Query.findAll({
          where: {
            id: { $in: req.query.query.split(',').map(i => parseInt(i, 10)) },
          },
        })
      ]).then(([ds, qs]) => {
        for (let d of ds) {
          for (let q of qs) {
            d.removeQuery(q);
          }
        }
        res.send('Done');
      }).catch(e => res.status(500).send({ error: e }));
    } else {
      res.status(400).send({ error: 'Select both dataset and query' });
    }
  },

  /**
   * Fetch.active make DatasetQuery as active
   *
   * {dataset: DatasetId}
   * {query: QueryId}
   * {active: bool}
   */
  active: (req, res) => {
    if ('dataset' in req.query && 'query' in req.query && 'active' in req.query) {
      m.DatasetQuery.update({
        active: req.query.active,
      }, {
        where: {
          QueryId: req.query.query,
          DatasetId: {
            $in: req.query.dataset.split(',').map(i => parseInt(i, 10))
          },
        },
      }).then(r => res.json(r))
      .catch(e => res.status(500).send({ error: e }));
    } else {
      res.status(400).send({ error: 'Select both dataset and query or define active' });
    }
  },
};
