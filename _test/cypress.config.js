const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    video: false,
    screenshots: false,
    baseUrl: `http://localhost:${process.env.PORT || 8090}`, // Dynamic port
  },
});
