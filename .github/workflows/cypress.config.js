const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    specPattern: ".github/workflows/cypress/e2e/**/*.cy.js",
    supportFile: false,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  
    video: false,
    screenshots: false,
    baseUrl: `http://localhost:${process.env.PORT || 8090}`, // Dynamic port
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: ".github/workflows/cypress/results",
      overwrite: true,
      html: false,
      json: true,
    },
  },
});
