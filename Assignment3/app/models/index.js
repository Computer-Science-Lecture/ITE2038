const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');

const { config } = require('../lib');

const db = {};
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db,
);


fs.readdirSync(__dirname)
  .filter(file => path.extname(file) === '.js' && file !== path.basename(__filename))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.values(db)
  .filter(model => model.associate)
  .forEach(model => model.associate(db));

module.exports = Object.assign(db, {
  sequelize,
  Sequelize,
});
