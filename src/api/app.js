//app.js
const express = require("express");
const app = express();
const path = require('path');
const createError = require('http-errors');

const gameRouter = require('./routes/game');

app.use(express.static(path.join(__dirname, '../public/resources')));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/renderGrid.html'));
});

app.use('/api/v1/game', gameRouter);

// catch 404
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
  // // render the error page
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;