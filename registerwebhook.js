const axios = require('axios');

module.exports = {
    registerWebhook: async (access_token, repoFullName, webhookUrl) => {
        console.log("access_toke",access_token,"repoFullName",repoFullName,"webhookUrl",webhookUrl);
    try {
      const response = await axios.post(`https://api.github.com/repos/${repoFullName}/hooks`,{
        name: 'web',
        active: true,
        events: ['push'], // Adjust based on the events you want to listen to
        config: {
          url: webhookUrl,
          content_type: 'json',
        },
      }, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      console.log('Webhook registered successfully:', response.data);
    } catch (error) {
      console.error('Error registering webhook:', error.response ? error.response.data : 'No response');
      console.log("error",error);
    }
  }
};