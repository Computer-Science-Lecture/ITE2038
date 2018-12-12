const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

const fetch = require('../controllers/fetch');

const routes = { router };

fs.readdirSync(__dirname)
  .filter(file => path.extname(file) === '.js'
                  && file !== path.basename(__filename))
  .forEach((file) => {
    const name = path.basename(file, path.extname(file));
    routes[name] = require(`./${name}`);
  });

Object.entries(routes)
  .forEach(([name, route]) => {
    if (route.associate) {
      route.associate(routes);
    } else {
      router.use(`/${name}`, route);
    }
  });

router.post('/login', (req, res) => {
  console.log(req.session.user)
  if (req.body.email && req.body.password) {
    req.session.user = 'unknown';
    res.redirect('/seller.html');
    // res.redirect('/customer.html');
    // res.redirect('/delivery.html');
  } else {
    res.json({
      status: 'error',
      message: 'require email and password',
    });
  }
});

module.exports = router;
