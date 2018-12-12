const m = require('../models');
const {
  assert, io,
} = require('../lib');

module.exports = {
  index: (req, res, query) => m.Dataset.findAll(assert.object(query))
    .then(r => res.json(r)),
  show: (req, res, query) => m.Dataset.findOne(Object.assign(
    assert.object(query), {
      where: { id: req.params.did },
    },
  )).then(r => assert.result(res, r)),
  destroy: (req, res) => m.Dataset.destroy({ where: { id: req.params.did } })
    .then(r => res.json(r.toJSON())),
  create: (req, res) => {
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send({ error: 'No file was uploaded' });
    }

    let file = req.files.dataset;
    let filename = file.name.substring(0, file.name.indexOf('.'));
    let hashname = (() => {
      let hash = '';
      do { hash = io.hash(); } while (io.dir(io.path.temp).some(f => f === hash))
      return hash;
    })();

    io.write(io.path.join(io.path.temp, hashname), file.data)
      .then(file => io.extract(file, io.path.temp))
      .then(() => io.rename(io.path.join(io.path.temp, filename), io.path.join(io.path.data, hashname)))
      .then(dir => {
        Promise.all(io.dir(dir).filter(d => io.isDir(dir, d) && !d.startsWith('.')).map((dataset, index) => m.Dataset.create({
            name: dataset,
            title: req.body.title,
            episode: index + 1,
            path: io.path.join(hashname, dataset),
            description: req.body.description,
            size: io.dir(io.path.join(io.path.data, hashname, dataset)).length,
          })
        )).then(datasets => res.status(201).json(datasets))
          .catch(e => res.status(500).send(e));
        return dir;
      }).then(() => io.remove(io.path.join(io.path.temp, hashname)));
  },
  queries: (req, res) => (
    m.DatasetQuery.findAll({
      where: { DatasetId: req.params.did },
    }).then(r => assert.result(res, r))
  ),
  image: (req, res) => (
    m.Dataset.findOne({ where: { id: req.params.did } })
    .then(dataset => {
      const images = io.dir(io.path.join(io.path.data, dataset.path)).filter(io.isValid);
      if (req.params.iid < 0 || req.params.iid >= images.length) {
        res.status(404).send({ error: 'Not found' });
      } else {
        res.sendFile(io.path.join(io.path.data, dataset.path, images[req.params.iid]));
      }
    })
  ),
};
