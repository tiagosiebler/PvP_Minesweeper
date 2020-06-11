const EnumGridCellState = require('./enum/EnumGridCellState');
/**
 * @private Generate a matrix with given dimensions
 * @returns {array<array><object>} containing height x width matrix
  [height, width]
  ┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
  │ (index) │    0     │    1     │    2     │    3     │    4     │
  ├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
  │    0    │ [ 0, 0 ] │ [ 0, 1 ] │ [ 0, 2 ] │ [ 0, 3 ] │ [ 0, 4 ] │
  │    1    │ [ 1, 0 ] │ [ 1, 1 ] │ [ 1, 2 ] │ [ 1, 3 ] │ [ 1, 4 ] │
  │    2    │ [ 2, 0 ] │ [ 2, 1 ] │ [ 2, 2 ] │ [ 2, 3 ] │ [ 2, 4 ] │
  │    3    │ [ 3, 0 ] │ [ 3, 1 ] │ [ 3, 2 ] │ [ 3, 3 ] │ [ 3, 4 ] │
  │    4    │ [ 4, 0 ] │ [ 4, 1 ] │ [ 4, 2 ] │ [ 4, 3 ] │ [ 4, 4 ] │
  │    5    │ [ 5, 0 ] │ [ 5, 1 ] │ [ 5, 2 ] │ [ 5, 3 ] │ [ 5, 4 ] │
  │    6    │ [ 6, 0 ] │ [ 6, 1 ] │ [ 6, 2 ] │ [ 6, 3 ] │ [ 6, 4 ] │
  │    7    │ [ 7, 0 ] │ [ 7, 1 ] │ [ 7, 2 ] │ [ 7, 3 ] │ [ 7, 4 ] │
  │    8    │ [ 8, 0 ] │ [ 8, 1 ] │ [ 8, 2 ] │ [ 8, 3 ] │ [ 8, 4 ] │
  │    9    │ [ 9, 0 ] │ [ 9, 1 ] │ [ 9, 2 ] │ [ 9, 3 ] │ [ 9, 4 ] │
  └─────────┴──────────┴──────────┴──────────┴──────────┴──────────┘


*/
module.exports = (maxHeight, maxWidth) => {
  const grid = [];

  for (let heightIndex = 0;heightIndex < maxHeight;heightIndex++) {
    !grid[heightIndex] && (grid[heightIndex] = []);

    for (let widthIndex = 0;widthIndex < maxWidth;widthIndex++) {
      grid[heightIndex][widthIndex] = {
        hasMine: false,
        counter: -1,
        state: EnumGridCellState.hidden,
        h: heightIndex,
        w: widthIndex
      };
    }
  }

  return grid;
};