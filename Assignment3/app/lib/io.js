const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const io = {
  path: {
      join: path.join,
  },
  isValid: file => !file.startsWith('.'),
  isExist: file => fs.existsSync(file),
  isDir: dirname => io.isExist(dirname) && fs.lstatSync(dirname).isDirectory(),
  mkdir: (target) => {
    target.split(path.sep).reduce((parent, child) => {
      const cur = path.resolve('.', parent, child);
      try {
        fs.mkdirSync(cur);
      } catch (e) {
        if (e.code === 'EEXIST')
          return cur;
        else if (e.code === 'ENOENT')
          throw new Error('EACCES: permission denied');
      }
      return cur;
    }, path.isAbsolute(target) ? path.sep : '');
  },
  rmdir: (target) => {
    if (!fs.existsSync(target)) return;

    io.dir(target).forEach((file) => {
      const current = io.path.join(target, file);

      if (fs.lstatSync(current).isDirectory()) {
        io.rmdir(current);
      } else {
        io.remove(current);
      }
    });
    fs.rmdirSync(target);
  },
  dir: dirname => fs.readdirSync(dirname),
  read: filename => new Promise((res, rej) => {
    fs.readFile(filename, (e, data) => {
      if (e) rej(e);
      res(data);
    });
  }),
  readSync: filename => fs.readFileSync(filename),
  write: (filename, data) => new Promise((res, rej) =>
    fs.writeFile(filename, data, e => {
      if (e) rej(e);
      res(filename);
    })
  ),
  writeSync: (filename, data) => fs.writeFileSync(filename, data),
  hash: (len = 12) => crypto.randomBytes(len).toString('hex'),
  rename: (oldPath, newPath) => new Promise((res, rej) => (
    fs.rename(oldPath, newPath, e => {
      if (e) rej(e);
      res(newPath);
    })
  )),
  remove: path => fs.unlinkSync(path),
};

module.exports = io;
