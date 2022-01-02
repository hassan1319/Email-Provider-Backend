"use strict";
const _ = require("lodash");
const { sendEmail } = require("../utils/aws");

const pollEmails = async (context) => {
  const knex = context.knex;

  // CHECK IN EMAILS TABLE IF ANY EMAIL NEEDS TO BE SENT
  // LIMIT 5 AT A TIME, FOR MANAGING SERVER LOAD
  const emails = await knex("emails").where({ status: "pending" }).limit(5);
  const providers = await knex("email_providers").where({ status: true });

  // IF EMAILS NEED SENDING
  if (!emails) return;

  for (let email of emails) {
    let emailSent = false;
    // CHECK EMAIL PROVIDER IS STILL ENABLED
    const providerIndex = _.findIndex(providers, {
      id: email.provider,
      status: true,
    });

    if (providerIndex >= -1 && providers[providerIndex]?.credentials) {
      try {
        // SEND EMAIL FROM THE PROVIDER
        // SINCE WE'VE JUST 1 PROVIDER RIGHT NOW I.E. AWS SES SO USING IT DIRECTLY
        // IN CASE OF MULTIPLE PROVIDERS CALL THE PROVIDER'S RELEVANT SEND EMAIL METHOD
        const sending = await sendEmail(
          {
            from: providers[providerIndex].credentials.from,
            to: email.to_email,
            subject: email.subject,
            body: email.body,
          },
          providers[providerIndex].credentials
        );

        // EMAIL SENT NOW UPDATE STATUS
        await knex("emails")
          .update({
            status: "sent",
          })
          .where({ id: email.id });
        emailSent = true;
      } catch (err) {
        emailSent = false;
      }
    }

    // EMAIL STILL NOT SENT, SET NEXT PROVIDER TO EMAIL
    if (!emailSent) {
      // ROUND ROBIN NEXT PROVIDERS INDEX
      let newProviderIndex = (providerIndex + 1) % providers.length;

      await knex("emails")
        .update({
          provider: providers[newProviderIndex]?.id,
        })
        .where({ id: email.id });
    }
  }

  // POLL EMAILS EVERY 500ms
  setTimeout(() => {
    pollEmails(context);
  }, 500);
};

module.exports = {
  /**
   * CREATE EMAIL
   *
   * @return {Array}
   */
  async longPollEmails(context) {
    pollEmails(context);
  },
};
