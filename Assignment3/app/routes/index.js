const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

const m = require('../models');

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

// Session debug
router.get('/session', (req, res) => {
  res.json(req.session);
});

router.post('/login', (req, res) => {
  if (req.body.email && req.body.password) {
    const cond = {
      where: {
        local: '',
        domain: '',
        passwd: req.body.password,
      },
      raw: true
    };
    [cond.where.local, cond.where.domain] = req.body.email.split('@');

    m.Seller.findOne(cond)
    .then(user => {
      if (user === null) throw new Error('Invalide email or password')
      delete user.passwd;
      req.session.user = user;
      req.session.type = 'seller'
      res.sendFile('seller.html', {
        root: path.join(__dirname, '../../site'),
      });
    }).catch(() => m.Customer.findOne(cond)
    .then(user => {
      if (user === null) throw new Error('Invalide email or password')
      delete user.passwd;
      req.session.user = user;
      req.session.type = 'customer'
      res.sendFile('customer.html', {
        root: path.join(__dirname, '../../site'),
      });
    }).catch(() => m.Delivery.findOne(cond)
    .then(user => {
      if (user === null) throw new Error('Invalide email or password')
      delete user.passwd;
      req.session.user = user;
      req.session.type = 'delivery'
      res.sendFile('delivery.html', {
        root: path.join(__dirname, '../../site'),
      });
    }).catch(() => {
      res.json({
        status: 'error',
        message: 'Invalid email or password',
      });
    })));
  } else {
    res.json({
      status: 'error',
      message: 'require email and password',
    });
  }
});

module.exports = router;
