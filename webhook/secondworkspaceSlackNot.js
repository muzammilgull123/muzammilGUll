const axios = require('axios');
const slack = require("@slack/bolt");
const dotenv = require('dotenv');
dotenv.config();

async function sendtotestSlackNotification(message, channel) {
    const app = new slack.App({
        signingSecret: process.env.SLACK_SIGNING_SECRET1,
        token: process.env.SLACK_BOT_TOKEN1,
    });

    await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: "#test", // Use the provided channel ID dynamically
        text: message,
    });
}

module.exports = { 
    sendtotestSlackNotification
};
