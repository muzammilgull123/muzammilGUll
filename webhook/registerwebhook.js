const axios = require('axios');

module.exports = {
    registerWebhook: async (owner, repo, webhookUrl,access_token) => {
        console.log(
            "owner", owner,
            "repo", repo,
            "webhookUrl", webhookUrl);

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
                    Authorization: `token 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`,
                    'X-GitHub-Api-Version': '2022-11-28'
                },
            });

            console.log('Webhook registered successfully:', response.data);
        } catch (error) {
            console.log("GitHub API response:", error.response.data);
            console.error('Error registering webhook:', error.message);
        }
    }
};
