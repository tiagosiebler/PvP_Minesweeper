const express = require("express");

const GameManager = require('../../game/GameManager');

const EnumGridCellState = require('../../game/util/enum/EnumGridCellState');
const app = express();

const setupEndpoints = sharedState => {
  app.get('/enum/cellState', (req, res) => {
    return res.json(EnumGridCellState);
  });

  app.put('/cell', (req, res) => {
    const hIndex = req.body.heightIndex;
    const wIndex = req.body.widthIndex;
    const playerId = req.body.playerId;

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
      res.status(400);
      return res.json({
        message: 'Game ended due to ' + gameState.stateCode + '. Start new game to continue'
      });
    }

    if (!gameState.isPlayerTurn(playerId)) {
      res.status(400);
      const message = `Not your turn - player ${playerId}! Waiting on player ${gameState.getPlayerTurn()}`;
      return res.json({ message: message });
    }

    const gameEvent = gameState.exposeCell(hIndex, wIndex);
    sharedState.emitGameEvent(gameEvent.key, gameEvent);
    return res.json(gameEvent);
  });

  // get game state
  app.get('/', (req, res) => {
    try {
      const height = 10;
      const width = 15;

      const mines = 25;

      const gridOptions = {
        height: height,
        width: width,
        totalMines: mines
      };

      const existingState = sharedState.gameState;
      if (existingState && existingState.isActive()) {
        return res.json(existingState.getGrid());
      }

      // start new game
      sharedState.gameState = new GameManager(gridOptions)
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