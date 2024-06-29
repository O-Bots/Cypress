const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.automationexercise.com/",
    viewportHeight: 1200,
    viewportWidth: 1000,
    defaultCommandTimeout: 1000,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
});
