const menus = require('express').Router({ mergeParams: true });

const menu = require('../controllers/menus');

menus.route('/')
  .get(menu.index)
  .post(menu.create);

menus.route('/:menu_id')
  .get(menu.show)
  .put(menu.update)
  .delete(menu.destroy);

module.exports = menus;
