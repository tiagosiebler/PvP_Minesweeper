const generateGrid = require('./util/generateGrid');
const assert = require('assert');
const debug = require('debug');

const getRandomInteger = require('./util/math/getRandomInteger');
const EnumErrorsGrid = require('./util/enum/EnumErrorsGrid');
const EnumGridCellState = require('./util/enum/EnumGridCellState');

const { getCell, getAdjacentCells } = require('./util/gridGetters');

class GameManager {
  constructor({ height = 10, width = 10, totalMines = 10 }) {
    this.dimensions = { height, width };

    this.mines = {
      total: totalMines,
      placed: 0
    };

    this.grid;

    this.stateCode = 'active';
    this.playerTurn = 1;
  }

  isActive() {
    return this.stateCode == 'active';
  }

  getPlayerTurn() {
    return this.playerTurn;
  }

  isPlayerTurn(playerId) {
    return this.playerTurn == playerId;
  }

  togglePlayerTurn() {
    this.playerTurn = this.playerTurn == 1 ? 2 : 1;
  }

  end(reason) {
    this.stateCode = reason;
  }

  getState() {
    return {
      grid: this.getGrid(),
      dimensions: this.getDimensions(),
      mines: this.mines
    };
  }

  log(component, ...params) {
    debug('grid:' + component + '()')(...params);
  }

  logGrid() {
    console.table(this.getGrid().map(rows => rows.map(cells => JSON.stringify(cells))));
  }

  getDimensions() {
    return this.dimensions;
  }

  getGrid() {
    const grid = this.grid;
    assert(grid, EnumErrorsGrid.GridMatrixNotReady);
    return grid;
  }

  getCell(heightIndex, widthIndex, grid = this.getGrid()) {
    return getCell(heightIndex, widthIndex, grid);
  }

  /**
   * @public Generate an initial grid matrix and store it.
   */
  generate() {
    const { height, width } = this.getDimensions();
    this.log('generateGrid', `Placing grid with dimensions: h${height} w${width}`);
    this.grid = generateGrid(height, width);
    return this;
  }

  /**
   * @public Position mines across a generated grid
   */
  placeMines() {
    const { height, width } = this.getDimensions();
    const totalMines = this.mines.total;
    this.log('placeMines', `Placing ${totalMines} mines in grid: h${height} w${width}`);

    for (let mineCount = 0;mineCount < totalMines;mineCount++) {
      const randomHeightIndex = getRandomInteger(height - 1);
      const randomWidthIndex = getRandomInteger(width - 1);

      const cell = this.getCell(randomHeightIndex, randomWidthIndex);
      if (cell.hasMine) {
        this.log('placeMines', `Skipping cell h${randomHeightIndex} w${randomWidthIndex} as it already has a mine`);
        mineCount--;
        continue;
      }

      this.log('placeMines', `Placed mine @ h${randomHeightIndex} w${randomWidthIndex}`);
      cell.hasMine = true;
      // delete cell.counter;
      this.mines.placed++;
    }

    return this;
  }

  /**
   * @public Iterate through each cell and populate counter with number of adjacent cells
   */
  placeMineCounters() {
    const totalMinesPlaced = this.mines.placed;
    assert(totalMinesPlaced, EnumErrorsGrid.MinesNotPlaced);

    const { height, width } = this.getDimensions();

    for (let hIndex = 0;hIndex < height;hIndex++) {
      for (let wIndex = 0;wIndex < width;wIndex++) {
        const currentCell = this.getCell(hIndex, wIndex);

        if (currentCell.hasMine) {
          // delete currentCell.counter;
          continue;
        }
        // delete currentCell.hasMine;
        const adjacentCells = getAdjacentCells(hIndex, wIndex, this.getGrid());
        currentCell.counter = adjacentCells.filter(cell => cell && cell.hasMine).length;
      }
    }
    return this;
  }

  exposeCell(hIndex, wIndex, playerId = this.getPlayerTurn()) {
    const cell = this.getCell(hIndex, wIndex);
    if (!cell) {
      throw new Error(`No cell found at index h${hIndex} w${wIndex}`);
    }

    const gameEvent = {
      key: 'cellUpdate',
      cellState: cell,
      eventPlayerId: playerId
    };

    if (cell.state == EnumGridCellState.exposed) {
      return gameEvent;
    }

    this.togglePlayerTurn();
    if (!cell.hasMine) {
      cell.state = EnumGridCellState.exposed;
      return gameEvent;
    }

    cell.state = EnumGridCellState.mine;
    const eventReason = 'mine';
    this.end(eventReason);

    gameEvent.key = 'gameEnd';
    gameEvent.reason = 'Player ' + playerId + ' hit by ' + eventReason;
    return gameEvent;
  }
}

module.exports = GameManager;