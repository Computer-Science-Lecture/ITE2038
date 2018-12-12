## Install

Dev stacks

- Node.js
- MySQL >= 8

### Prepare app

```
npm install
```

### Prepare database

Run code below for allow *node.js* access to mysql.

```
ALTER USER 'user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
```

Refer to `config.example.json` and fill `config.json`. *(such as username, password, database, ...)*

### Run

```
npm start
```
