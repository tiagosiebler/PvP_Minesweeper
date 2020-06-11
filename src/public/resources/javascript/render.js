function createGridInContainer(container, containerWidth, height, width) {
    var domGridMatrix = [];
    console.log({height, width, containerWidth})
    for (var i = 0; i < height;i++) {
      if (!domGridMatrix[i]) {
        domGridMatrix[i] = []
      };

      for (var y = 0;y < width;y++) {
        const gridCell = {}
        domGridMatrix[i][y] = gridCell;

        var dimension = containerWidth / width;
        var cell = document.createElement('div');
        cell.className = cell.className + ' gridCell' + ` h${i} w${y}`;
        cell.style.width = dimension + 'px';
        cell.style.height = dimension + 'px';

        gridCell.domRef = cell;
        gridCell.heightIndex = i;
        gridCell.widthIndex = y;

        container.appendChild(cell);
      }
    }
    return domGridMatrix;
}

function updateGridState(domGridMatrix, gameStateMatrix, EnumCellState) {
  domGridMatrix.map((row, hIndex) => row.map((domCell, wIndex) => {
    const gameCell = gameStateMatrix[hIndex][wIndex];
    var a = EnumCellState;
    debugger;
  }));

  debugger;
}

const fetchGrid = () => {
  return fetch('api/v1/game/testGrid').then(response => response.json());
}
const fetchEnums = () => {
  return fetch('api/v1/game/enum/cellState').then(response => response.json());
}

(async () => {
  // TODO: Promise.all()
  const grid = await fetchGrid();
  const enums = await fetchEnums();

  const container = document.getElementById('gameCanvas');
  const width = container.offsetWidth;

  const row = grid[0];
  const gridHeight = grid.length;
  const gridWidth = row.length;

  const domGridMatrix = createGridInContainer(container, width, gridHeight, gridWidth);

  updateGridState(domGridMatrix, grid, enums);

  // console.log(JSON.stringify(grid, null, 1));
  // console.table(grid);
  //
  // debugger;
})();
;