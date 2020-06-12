const GameManager = require('./src/game/GameManager');

/*
Notes:
- coodinates are inversed to adhere with array ordering. Axis starts at top-left, instead of traditional bottom-left.

-[x] generate grid with h/w dimensions.
-[x] position z mines randomly across grid.
-[x] precalc cell numbering on adjacent mines.
-[x] basic test coverage

TODO:
- [ ] inversed height with? x:y (width height? what's x normally, width I think?)
- [ ] run state through db
*/

const setupGame = () => {
  try {
    const height = 15;
    const width = 10;
    const mines = 10;

    const gridOptions = {
      height: height,
      width: width,
      totalMines: mines
    };

    const gameGrid = new GameManager(gridOptions)
      .generate()
      .placeMines()
      .placeMineCounters();

    gameGrid.logGrid();

    // console.log('grid: ', JSON.stringify(gameGrid.getGrid()));
  } catch (e) {
    console.error('setupGame failed: ', e.stack || e);
  }
};

setTimeout(() => setupGame(), 1000);
