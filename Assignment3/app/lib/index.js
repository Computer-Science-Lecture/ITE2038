const fs = require('fs');
const path = require('path');

const lib = {};

// Load config or set default from environment variables
const config = 'config.json'

if (fs.existsSync(config)) {
  lib.config = JSON.parse(fs.readFileSync(config));
} else {
  lib.config = {
    app: {
      secret: '',
      port: 80,
    },
    db: {
      database: process.env.DBName,
      username: process.env.DBUser,
      password: process.env.DBPass,
      host: process.env.DBHost,
      port: process.env.DBPort,
      dialect: "mysql",
      define: {
        charset: "utf8",
        collate: "utf8_unicode_ci"
      },
    }
  }
}

/* eslint-disable global-require */
fs.readdirSync(__dirname)
  .filter(file => path.extname(file) === '.js' && file !== path.basename(__filename))
  .forEach((file) => {
    const name = path.basename(file, path.extname(file));
    lib[name] = require(`./${name}`);
  });
/* eslint-enable global-require */

lib.io.path = Object.assign(lib.io.path, lib.config.path);

module.exports = lib;
