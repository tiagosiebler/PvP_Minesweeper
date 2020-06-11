
(() => {
  try {
    const apiService = require('./src/api/server');
  } catch (e) {
    console.error('API Service failed to start due to error: ', e);
  }
})();