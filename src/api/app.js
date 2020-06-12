//app.js
const express = require("express");
const path = require('path');
const createError = require('http-errors');

const setupGameRouter = require('./routes/game');

const getExpressApp = sharedState => {
  const app = express();
  app.use(express.static(path.join(__dirname, '../public/resources')));

  app.use(express.json());

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game.html'));
  });

  app.use('/api/v1/game', setupGameRouter(sharedState));

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    if (err.status == 404) {
      res.status(err.status);
      return res.json({ message: 'API endpoint not found'});
    }

    return next();
  });

  return app;
}

module.exports = getExpressApp;