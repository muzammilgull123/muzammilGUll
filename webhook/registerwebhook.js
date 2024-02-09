const axios = require('axios');

async function registerWebhook(owner, repo, webhookUrl, githubAppToken) {
    console.log(githubAppToken);
    try {
        const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
            name: 'web',
            active: true,
            events: ['push'],
            config: {
                url: webhookUrl,
                content_type: 'json',
                insecure_ssl: '0'
            },
        }, {
            headers: {
                Authorization: `token ${githubAppToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        console.log('Webhook registered successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering webhook:', error.message);
        throw error;
    }
}

module.exports = {registerWebhook};
