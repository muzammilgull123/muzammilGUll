const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const { registerWebhook } = require('./webhook/registerwebhook');




dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});

app.get('/login/github',(req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`;

  res.redirect(redirectUrl);
});

app.get('/github/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: process.env.GITHUB_APP_CLIENT_ID,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
        code: code,
        scope: 'repo admin:repo_hook',
      },
      headers: {
        accept: 'application/json',
      },
    });
   
    const webhookUrl = 'https://48f8-39-51-69-114.ngrok-free.app/webhook/github';
   const owner = 'muzammilgull123';
    const repo='muzammilGUll';
   
    
    const access_token = response.data.access_token;
      console.log(access_token);
   registerWebhook(owner,repo,webhookUrl)
  

    res.send('GitHub authentication successful!');
  } catch (error) {
    console.error('Error exchanging auth token for access token:', error);
    console.error('GitHub API Error:', error.response ? error.response.data : 'No response');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/webhook/github', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  // Handle GitHub webhook event
  console.log(req.body);

  res.send('GitHub webhook received!');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
