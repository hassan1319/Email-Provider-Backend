const express = require("express");
// FOR REQUEST BODY
var bodyParser = require("body-parser");
// FOR ENV VARS
require("dotenv").config();
// FOR EMAILS LONG POLLING
const { longPollEmails } = require("./server/utils/long-polling");

const app = express();
const port = 8000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const knex = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// CONTEXT WITH GLOBALLY REQUIRED CLIENTS
const context = {
  knex,
};

// Require our routes into the application.
require("./server/routes")(app, context);

// START EMAILS LONG POLLING
longPollEmails(context);

app.listen(port, () => {
  console.log(`Server now listening at PORT:${port}`);
});
