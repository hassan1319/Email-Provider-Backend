"use strict";
module.exports = {
  /**
   * GET PROVIDERS LIST
   *
   * @return {Array}
   */
  async getProviders(context, req, res) {
    const knex = context.knex;

    try {
      const providers = await knex("email_providers")
        .leftJoin("emails", "email_providers.id", "=", "emails.provider")
        .select(
          "email_providers.id",
          "email_providers.name",
          "email_providers.status",
          knex.raw("COUNT(DISTINCT emails.id) AS emails_count")
        )
        .groupBy("email_providers.id");

      res.status(200).send(providers);
    } catch (err) {
      console.log("Error", err);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
  /**
   * ENABLE/DISABLE PROVIDER
   *
   * @return {Array}
   */
  async toggleProvider(context, req, res) {
    const knex = context.knex;

    try {
      const { status, provider } = req.body || {};

      // PROVIDER AND STATUS TO UPDATE ARE MUST IN REQUEST
      if (typeof status === null || typeof status === undefined || !provider) {
        res.status(400).send({
          message: "Bad Request",
        });
      }

      // UPDATE PROVIDER STATUS
      await knex("email_providers")
        .update({
          status: req.body.status,
        })
        .where({ id: provider });

      res.status(200).send({});
    } catch (err) {
      console.log("Error", err);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
