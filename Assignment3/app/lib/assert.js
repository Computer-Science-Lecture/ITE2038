const Assert = {
  isType: (v, type) => (!!v && v.constructor === type),
  isArray: v => Assert.isType(v, Array),
  isObject: v => Assert.isType(v, Object),
  isString: v => Assert.isType(v, String),
  object: (v, d) => (Assert.isObject(v) ? v : (d || {})),
  array: (v, d) => (Assert.isArray(v) ? v : (d || [])),
  string: (v, d) => (Assert.isString(v) ? v : (d || '')),
  result: (res, r, f = (response, result) => response.json(result)) => {
    if (!r) {
      res.status(404);
      res.send({ error: 'Not found' });
    } else {
      f(res, r);
    }
  },
  param: (params, role) => Object.keys(params).reduce((t, p) => {
    if (params[p] && role[p]) {
      t[role[p]] = params[p];
    }
    return t;
  }, {}),
  ip: req => (req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress).split(',')[0],
};

module.exports = Assert;
