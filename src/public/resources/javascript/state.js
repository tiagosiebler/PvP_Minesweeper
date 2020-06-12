var EnumCellState;
var domGridMatrix;
var playerState = {
  playerId: document.location.search.includes('player1') ? 1 : 2
};

function handleEventCellUpdate(hIndex, wIndex, newCellState, event) {
  const domCell = domGridMatrix[hIndex][wIndex];
  console.warn('Game cell update ', hIndex, wIndex, newCellState);
  updateCellState(newCellState, domCell);
  event.nextPlayerId && handleTurnUpdate(event.nextPlayerId);
}
function handleTurnUpdate(nextPlayerId) {
  const message = nextPlayerId == playerState.playerId ? 'Your Turn!' : `Waiting on player ${nextPlayerId} to make a move...`;
  updateGameStateMessage(message);
}
function updateGameStateMessage(newMessage) {
  document.getElementById('gameState').innerText = newMessage;
}

function handleEventGameEnd(hIndex, wIndex, newCellState, event) {
  handleEventCellUpdate(hIndex, wIndex, newCellState, event);
  const { reason, eventPlayerId } = event;
  console.warn('Game ended because: ', reason);

  const prefix = eventPlayerId == playerState.playerId ? 'You lost! ' : 'You won! ';
  alert(prefix + reason);

  const gameStateMessage = `Player ${eventPlayerId == 1 ? 2 : 1} won! Refresh to start again.`;
  updateGameStateMessage(gameStateMessage);
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