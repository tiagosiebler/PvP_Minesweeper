const express = require("express");

const app = express();

const GridManager = require('../../game/GridManager');

const EnumGridCellState = require('../../game/util/enum/EnumGridCellState');

app.get('/enum/cellState', (req, res) => {
  return res.json(EnumGridCellState);
});

app.get("/testGrid", (req, res) => {
  try {
    const height = 15;
    const width = 10;

    const mines = 10;

    const gridOptions = {
      height: height,
      width: width,
      totalMines: mines
    };

    const gameState = new GridManager(gridOptions)
      .generate()
      .placeMines()
      .placeMineCounters();

    return res.json(gameState.getGrid());
  } catch (e) {
    const errorDate = new Date();
    console.error('API exception occurred', e.stack || e);
    res.status(500);
    res.json({
      message: 'API exception occurred',
      dt: errorDate
    });
  }
});


module.exports = app;