const axios = require('axios');
const { getRepoInfo } = require('../api/controller');
const { repoinfo } = require('./repoInfo');

async function registerWebhook(owner, repo, webhookUrl, token) {
   console.log("registerWebhook",token);
   console.log("owner",owner);
   console.log("repo",repo);
   console.log("webHookUrl",webhookUrl)
 try {
        const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/hooks`,{
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
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'muzammilnewapp'
                
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
