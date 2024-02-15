const axios = require('axios');
const { storeRegisterWebhook } = require('../api/services');
async function registerWebhook(owner, repo, webhookUrl, token,tokenId) {
   console.log("registerWebhook",token);
   console.log("owner",owner);
   console.log("repo",repo);
   console.log("webHookUrl",webhookUrl)
   console.log("token_id",token_id)
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
       
const webhookData = response.data;
const webhookType = webhookData.type;
const webhookId = webhookData.id;
const webhookName = webhookData.name;
const webhookActive = webhookData.active;
const webhookEvents = webhookData.events.join(','); 
const webhookCreatedAt = new Date(webhookData.created_at);
const webhookUpdatedAt = new Date(webhookData.updated_at);
const webhookTestUrl = webhookData.test_url;
const webhookPingUrl = webhookData.ping_url;
const webhookDeliveriesUrl = webhookData.deliveries_url;
const webhookLastResponseStatus = webhookData.last_response.status;
await storeRegisterWebhook(webhookType,webhookId,webhookName,webhookActive,webhookCreatedAt,webhookEvents,webhookUpdatedAt,webhookTestUrl,webhookPingUrl,webhookDeliveriesUrl,webhookLastResponseStatus,tokenId);
return response.data;
    } catch (error) {
        console.error('Error registering webhook:', error.message);
        throw error;
    }
}

module.exports = {registerWebhook};
