const axios = require('axios');

module.exports = {
    registerWebhook: async (owner, repo, webhookUrl) => {
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
