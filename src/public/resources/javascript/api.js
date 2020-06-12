/* Generic API Methods */
function apiPost(endpoint, body, method = 'POST') {
  return fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  .then(async response => {
    if (response.ok) {
      return response.json();
    }
    throw await response.json();
  });
}
function apiGet(endpoint) {
  return fetch(endpoint).then(response => response.json());
}

/* Custom API Wrappers */
function fetchEnumCellState() {
  return apiGet('api/v1/game/enum/cellState');
}

function fetchPlayerTurn() {
  return apiGet('api/v1/game/turn');
}

function apiGetGame() {
  return apiGet(`api/v1/game`);
}

function apiExposeCell(hIndex, wIndex) {
  const requestBody = {
    heightIndex: hIndex,
    widthIndex: wIndex,
    ...playerState
  };
  return apiPost(`api/v1/game/cell`, requestBody, 'PUT');
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
    const { cellState } = data;
    const { h: hIndex, w: wIndex } = cellState || {};

    switch(data.key) {
      case 'cellUpdate':
        return handleEventCellUpdate(hIndex, wIndex, cellState, data);

      case 'gameEnd':
        return handleEventGameEnd(hIndex, wIndex, cellState, data);

      default:
        console.warn('Unhandled WS Event Type: ', data);
    }
  };
  return ws;
}
