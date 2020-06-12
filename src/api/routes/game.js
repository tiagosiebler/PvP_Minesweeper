const express = require("express");

const GridManager = require('../../game/GridManager');

const EnumGridCellState = require('../../game/util/enum/EnumGridCellState');
const app = express();

const setupEndpoints = sharedState => {
  app.get('/enum/cellState', (req, res) => {
    return res.json(EnumGridCellState);
  });

  app.put('/cell/:heightIndex/:widthIndex', (req, res) => {
    const hIndex = req.params.heightIndex;
    const wIndex = req.params.widthIndex;

    if (!sharedState) {
      return res.status(500).json({message: 'state not ready'});
    }

    const gameState = sharedState && sharedState.gameState;
    if (!gameState) {
      res.status(404);
      return res.json({
        message: 'Game not found'
      });
    };

    if (!gameState.isActive()) {
      debugger;
    }

    // TODO: move state changes into GameManager, this should just pass-through events
    const cell = gameState.getCell(hIndex, wIndex);
    const event = {
      key: 'cellUpdate',
      cellState: cell
    };

    if (cell.hasMine) {
      cell.state = EnumGridCellState.mine;

      const eventReason = 'mine';
      gameState.end(eventReason);

      event.key = 'gameEnd';
      event.reason = eventReason;

      sharedState.emitGameEvent(event.key, event);
      return res.json(event);
    }

    cell.state = EnumGridCellState.exposed;

    sharedState.emitGameEvent(event.key, event);
    res.json(event);
  });

  app.get('/testGrid', (req, res) => {
    try {
      const height = 5;
      const width = 5;

      const mines = 5;

      const gridOptions = {
        height: height,
        width: width,
        totalMines: mines
      };

      sharedState.gameState = new GridManager(gridOptions)
        .generate()
        .placeMines()
        .placeMineCounters();

      const gameGrid = sharedState.gameState.getGrid();
      console.table(gameGrid.map(r => r.map(c => JSON.stringify(c))));
      return res.json(gameGrid);
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
  return app;
}

module.exports = setupEndpoints;