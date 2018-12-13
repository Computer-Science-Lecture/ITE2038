const menus = require('express').Router({ mergeParams: true });

const menu = require('../controllers/menus');

menus.route('/')
  .get(menu.index);

menus.route('/:menu_id')
  .get(menu.show);

module.exports = menus;
