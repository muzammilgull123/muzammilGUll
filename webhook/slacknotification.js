const axios = require('axios');

async function sendSlackNotification(message) {
    const webhookUrl ='https://hooks.slack.com/services/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';
    try {
        const response = await axios.post(webhookUrl, {
            text: message
        });
        console.log('Slack notification sent:', response.data);
    } catch (error) {
        console.error('Error sending Slack notification:', error.message);
    }
}

// https://hooks.slack.com/services/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
module.exports = { 
    sendSlackNotification
};
