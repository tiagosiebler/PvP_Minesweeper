function createGridInContainer(container, containerWidth, height, width) {
    var domGridMatrix = [];
    console.log({height, width, containerWidth})
    for (let i = 0; i < height;i++) {
      if (!domGridMatrix[i]) {
        domGridMatrix[i] = []
      };

      for (let y = 0;y < width;y++) {
        const gridCell = {}
        domGridMatrix[i][y] = gridCell;

        var dimension = containerWidth / width;
        var cell = document.createElement('div');
        cell.className = cell.className + ' fas gridCell';
        cell.style.width = dimension + 'px';
        cell.style.height = dimension + 'px';

        cell.addEventListener('click', () => handleCellClick(i, y));

        gridCell.domRef = cell;
        gridCell.heightIndex = i;
        gridCell.widthIndex = y;

        container.appendChild(cell);
      }
    }
    return domGridMatrix;
}

function handleCellClick(hIndex, wIndex) {
  return apiExposeCell(hIndex, wIndex).catch(e => {
    if (e && e.message) {
      return alert('Cannot expose cell - ' + e.message);
    }
    console.error('unhandled expose cell api error: ', e);
  })
}

function getClassForCellState(cellState) {
  const iconPrefix = 'fa-';
  const classPrefix = 'cellState';
  switch (cellState) {
    case EnumCellState.hidden:
      return classPrefix + 'Hidden';
    case EnumCellState.exposed:
      return classPrefix +'exposed';

    case EnumCellState.flagged:
      return iconPrefix + 'flag';
    case EnumCellState.markedMine:
      return iconPrefix + 'skull-crossbones';
    case EnumCellState.mine:
      return iconPrefix + 'bomb';

    default:
      console.warn(`getClassForCellState(${cellState}) unknown state!`);
      return iconPrefix + 'bug'
  }
}

(async () => {
  // TODO: add monitor to handle connection drops via ping/pong checks
  const ws = setupWebsocket();

  // TODO: Promise.all()
  const grid = await apiGetGame();
  EnumCellState = await fetchEnumCellState();
  const playerTurn = await fetchPlayerTurn();
  handleTurnUpdate(playerTurn.playerId);

  const container = document.getElementById('gameCanvas');
  const width = container.offsetWidth;

  const row = grid[0];
  const gridHeight = grid.length;
  const gridWidth = row.length;

  domGridMatrix = createGridInContainer(container, width, gridHeight, gridWidth);

  updateGridState(domGridMatrix, grid);
})();
