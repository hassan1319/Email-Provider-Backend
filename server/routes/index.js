const controllers = require("../controllers");

module.exports = (app, context) => {
  app.get("/api/providers", async (req, res) => {
    await controllers.getProviders(context, req, res);
  });
  app.put("/api/providers", async (req, res) => {
    await controllers.toggleProvider(context, req, res);
  });
  app.post("/api/email", async (req, res) => {
    await controllers.addEmail(context, req, res);
  });
};
