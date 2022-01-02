"use strict";
const AWS = require("aws-sdk");

module.exports = {
  async sendEmail(payload, credentials) {
    // SEND EMAIL
    // GETTING PROVIDER CREDENTIALS FROM DB
    if (
      !credentials.accessKeyId ||
      !credentials.secretAccessKey ||
      !credentials.region
    ) {
      throw Error("AWS CREDENTIALS MISSING");
    }
    const SES_CONFIG = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: credentials.region,
    };

    const AWS_SES = new AWS.SES(SES_CONFIG);

    let params = {
      Source: payload.from,
      Destination: {
        ToAddresses: [payload.to],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: payload.body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: payload.subject,
        },
      },
    };
    return await AWS_SES.sendEmail(params).promise();
  },
};
