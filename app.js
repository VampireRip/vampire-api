const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dir = require('./dir');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(logger('dev'));
app.use((req, res, next) => {
  if (req.hostname === "os.vampire.rip") {
    return express.static(path.resolve(dir.os, '.'))(req, res, next)
  }
  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/github-webhook/vampire', require('./webhook/vampire'));
app.use(express.static(path.resolve(dir.vampire, 'public')));

app.use((req, res, next) => {
  if(res.headersSent) return;
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  if(res.headersSent) return;
  if(err instanceof Error) {
    return res.status(res.statusCode || 500).send(err.stack || err);
  }
  res.sendStatus(501);
});

module.exports = app;
