const axios = require('axios');
const slack = require("@slack/bolt");
const dotenv = require('dotenv');
dotenv.config();

async function sendSlackNotification(message, channel) {
    const app = new slack.App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN,
    });

    await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: channel, // Use the provided channel ID dynamically
        text: message,
    });
}

module.exports = { 
    sendSlackNotification
};
