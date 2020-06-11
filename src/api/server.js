//server.js
const app = require("./app");

app.listen(8080, () => {
  console.log("API service running on port 8080!");
});

module.exports = app;