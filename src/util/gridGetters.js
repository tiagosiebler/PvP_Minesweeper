
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
 */
const getAdjacentCells = (heightIndex = 1, widthIndex = 1, grid = []) => {
    // start top left of current cell
    const originHeight = heightIndex - 1;
    const originWidth = widthIndex - 1;

    const adjacentCells = [];

    //   [x,x,x],
    //   [ ,c, ],
    //   [ , , ]
    adjacentCells.push(getCellForGrid(originHeight, originWidth, grid));
    adjacentCells.push(getCellForGrid(originHeight, originWidth + 1, grid));
    adjacentCells.push(getCellForGrid(originHeight, originWidth + 2, grid));

    //   [ , , ],
    //   [x,c,x],
    //   [ , , ]
    adjacentCells.push(getCellForGrid(originHeight + 1, originWidth, grid));
    adjacentCells.push(getCellForGrid(originHeight + 1, originWidth + 2, grid));

    // [
    //   [ , , ],
    //   [ ,c, ],
    //   [x,x,x]
    // ]
    adjacentCells.push(getCellForGrid(originHeight + 2, originWidth, grid));
    adjacentCells.push(getCellForGrid(originHeight + 2, originWidth + 1, grid));
    adjacentCells.push(getCellForGrid(originHeight + 2, originWidth + 2, grid));

    // invalid coordinates (out of range) will return false. Filter these out:
    return adjacentCells.filter(cell => cell);
}

module.exports = {
  getCell: getCellForGrid,
  getAdjacentCells
};