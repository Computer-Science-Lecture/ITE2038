const banks = require('express').Router({ mergeParams: true });

const bank = require('../controllers/banks');

banks.route('/')
  .get(bank.index);

module.exports = banks;
