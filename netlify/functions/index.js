const serverless = require("serverless-http");
const { app } = require("../../app");

// Set EJS as the templating engine
app.set('view engine', 'ejs');

module.exports.handler = serverless(app);