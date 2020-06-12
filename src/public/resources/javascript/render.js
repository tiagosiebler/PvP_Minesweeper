var EnumCellState;
var domGridMatrix;
var playerState = {
  playerId: 1
};

function apiPost(endpoint, body, method = 'POST') {
  return fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
};
function apiGet(endpoint) {
  return fetch(endpoint).then(response => response.json());
}

function fetchGrid() {
  return apiGet('api/v1/game/testGrid');
}
function fetchEnumCellState() {
  return apiGet('api/v1/game/enum/cellState');
}
function apiExposeCell(hIndex, wIndex) {
  return apiPost(`api/v1/game/cell/${hIndex}/${wIndex}`, playerState, 'PUT');
}

function setupWebsocket() {
  const ws = new WebSocket('ws://localhost:8081');
  ws.onopen = () => {
    console.log('Now connected to WS');
  };
  ws.onmessage = message => {
    const dataRaw = message && message.data;
    const data = JSON.parse(dataRaw);

    if (!data.key) {
      return console.error('Unhandled WS Message Category: ', data, message);
    }
    const { cellState, reason: eventReason } = data;
    const { h: hIndex, w: wIndex } = cellState || {};

    switch(data.key) {
      case 'cellUpdate':

        return handleEventCellUpdate(hIndex, wIndex, cellState);

      case 'gameEnd':
        return handleEventGameEnd(hIndex, wIndex, cellState, eventReason);

      default:
        console.warn('Unhandled WS Event Type: ', data);
    }
  };
  return ws;
}

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
  const gameCell = domGridMatrix[hIndex][wIndex];
  console.log('clickedCell', gameCell, gameCell.rawState);

  return apiExposeCell(hIndex, wIndex);
}

function handleEventCellUpdate(hIndex, wIndex, newCellState) {
  const domCell = domGridMatrix[hIndex][wIndex];
  return updateCellState(newCellState, domCell);
}

function handleEventGameEnd(hIndex, wIndex, newCellState, eventReason) {
  handleEventCellUpdate(hIndex, wIndex, newCellState);
  console.warn('Game ended because: ', eventReason);
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

function clearPreviousCellGameState(domCell) {
  const { domRef } = domCell;
  if (!domRef || !domRef.classList) {
    debugger;
  }

  const domClassList = domRef.classList;
  if (!Array.isArray(domClassList) && typeof domClassList != 'object') {
    debugger;
  }

  const classList = new Array(...domClassList);

  const cellClassList = classList.filter(prop => prop.startsWith('fa-') || prop.startsWith('cellState'));
  if (!cellClassList.length) {
    return;
  }

  domClassList.remove(...cellClassList);
}

function updateCellState(newCellState, domCell) {
  const { domRef } = domCell;

  const currentDomClassValue = getClassForCellState(newCellState.state);

  clearPreviousCellGameState(domCell);
  domCell.rawState = newCellState;
  domRef.classList.add(currentDomClassValue);

  if (newCellState.state == EnumCellState.exposed && !newCellState.hasMine) {
    domRef.innerText = newCellState.counter
  };
}

function updateGridState(domGridMatrix, gameStateMatrix) {
  domGridMatrix.map((row, hIndex) => row.map((domCell, wIndex) => {
    const gameCell = gameStateMatrix[hIndex][wIndex];
    updateCellState(gameCell, domCell);
  }));
}

(async () => {
  // TODO: add monitor to handle connection drops via ping/pong checks
  const ws = setupWebsocket();

  // TODO: Promise.all()
  const grid = await fetchGrid();
  EnumCellState = await fetchEnumCellState();

  const container = document.getElementById('gameCanvas');
  const width = container.offsetWidth;

  const row = grid[0];
  const gridHeight = grid.length;
  const gridWidth = row.length;

  domGridMatrix = createGridInContainer(container, width, gridHeight, gridWidth);

  updateGridState(domGridMatrix, grid);
})();
