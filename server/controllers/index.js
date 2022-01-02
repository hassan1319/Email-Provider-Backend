"use strict";

const { getProviders, toggleProvider } = require("./email_provider");
const { addEmail } = require("./email");

module.exports = {
  getProviders,
  toggleProvider,
  addEmail,
};
