"use strict";
module.exports = {
  /**
   * CREATE EMAIL
   *
   * @return {Array}
   */
  async addEmail(context, req, res) {
    const knex = context.knex;

    try {
      const { from_name, to_name, to_email, subject, body } = req.body || {};

      // REQUIRED PARAMS
      if (!from_name || !to_name || !to_email || !subject || !body) {
        res.status(400).send({
          message: "Bad Request",
        });
      }

      // FETCH LIST OF PROVIDERS
      const provider = await knex("email_providers")
        .where({ status: true })
        .select("id")
        .first();

      if (!provider) {
        res.status(400).send({
          message: "No Email Provider Enabled",
        });
      }

      // CREATE EMAIL AND RETURN ID
      const emailId = (
        await knex("emails").insert(
          {
            from_name,
            to_name,
            to_email,
            subject,
            body,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            provider: provider?.id,
          },
          "id"
        )
      )[0];

      res.status(200).send({ id: emailId });
    } catch (err) {
      console.log("Error", err);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
