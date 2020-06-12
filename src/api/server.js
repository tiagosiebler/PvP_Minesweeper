const WebSocket = require('ws');
const EventEmitter = require('events');

const getExpressApp = require("./app");

// TODO: ideally we don't pass around an object and use a proper DB
class SharedState extends EventEmitter {}
const sharedState = new SharedState();

// Setup REST API and routers
const app = getExpressApp(sharedState);
app.listen(8080, () => {
  console.log("API service running on port 8080!");
});

// Setup WS server
const socketServer = new WebSocket.Server({port: 8081});
socketServer.on('connection', socketClient => {
  console.log('connected');
  console.log('Number of clients: ', socketServer.clients.size);


  socketClient.on('close', socketClient => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});

sharedState.emitGameEvent = (key, parameters) => {
  const event = {
    key: key,
    ...parameters
  }
  sharedState.emit('gameEvent', event);
}
sharedState.on('gameEvent', event => {
  socketServer.clients.forEach(client => {
    client.send(JSON.stringify(event));
  });
})


module.exports = app;