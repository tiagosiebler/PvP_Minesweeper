
/**
 * @public Get cell from a grid
 * @returns {object|boolean} cell object if found. false if out of bounds.
 */
const getCellForGrid = (heightIndex = 1, widthIndex = 1, grid = []) => {
  if (!grid.length || heightIndex < 0 || widthIndex < 0) {
    return false;
  }

  if (grid.length <= heightIndex) {
    return false;
  }

  const row = grid[heightIndex];
  if (!row || row.length <= widthIndex) {
    return false;
  }

  return grid[heightIndex][widthIndex];
}


/**
 * @public Get adjacent cells from current position in grid
 * @returns {Array<object>} Array containing cells adjacent to the current position.
 * [x,x,x],
 * [x, ,x],
 * [x,x,x]
 */
const getAdjacentCells = (heightIndex = 1, widthIndex = 1, grid = []) => {
  // start top left of current cell
  const originHeight = heightIndex - 1;
  const originWidth = widthIndex - 1;

  const adjacentCells = [];
  const steps = 3;
  for (let i = 0;i < steps;i++) {
    for (let y = 0;y < steps;y++) {
      const hIndex = originHeight + i;
      const wIndex = originWidth + y;

      // skip the current cell
      if (hIndex == heightIndex && wIndex == widthIndex) {
        continue;
      }

      adjacentCells.push(getCellForGrid(hIndex, wIndex, grid));
    }
  }

  // invalid coordinates (out of range) will return false. Filter these out:
  return adjacentCells.filter(cell => cell);
}

module.exports = {
  getCell: getCellForGrid,
  getAdjacentCells
};