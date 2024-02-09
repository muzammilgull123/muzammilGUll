const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const { registerWebhook } = require('./webhook/registerwebhook');
// const { getPersnalAccessToken } = require('./webhook/persnalAccessToken');
const {createPersonalAccessToken} = require('./webhook/persnalAccessToken');
const pool = require('./dbconfig');
const router = require('./api/router');
const { storeGithHubTokeninfo, weebHookResult } = require('./api/controller');




dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;
try {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      process.exit(1); 
    }
    console.log('Connected to the database!');
    connection.release(); 
  });
} catch (error) {
  console.error('Error connecting to database:', error);
  process.exit(1); // Exit the process with an error code
}


app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});

app.get('/login/github',(req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`;
  // const redirectUrl2 ="http://localhost:3001/thankyou?thankyou"
  res.redirect(redirectUrl);
 
});

app.get('/github/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token',null,{
      params: {
        client_id: process.env.GITHUB_APP_CLIENT_ID,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
        code: code,
        // scope: 'repo admin:repo_hook admin:org',
      },
      headers: {
        accept: 'application/json',
      },
    });
   
    const webhookUrl = 'https://05a9-39-34-139-137.ngrok-free.app/webhook/github';
    
   const owner = 'muzammilgull123';
    const repo='muzammilGUll';
   
    
    const oauthToken = response.data.access_token;
      console.log(oauthToken,"oauthToken");
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${oauthToken}`,
        },
        
      });
     const userName= userResponse.data.login;
     const userid = userResponse.data.id;
     storeGithHubTokeninfo(userName,userid,oauthToken);


      // const persnalToken= await createPersonalAccessToken(oauthToken);
      // console.log("persnalToken",persnalToken);

      await registerWebhook(owner, repo, webhookUrl, oauthToken);
  

    res.send('GitHub authentication successful!');
  } catch (error) {
    console.error('Error exchanging auth token for access token:', error);
    console.error('GitHub API Error:', error.response ? error.response.data : 'No response');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  const reponame = req.body.repository.name;
  const repofullname=req.body.repository.full_name;
  const ssh_url=req.body.repository.ssh_url;
  const pushed_at=req.body.repository.pushed_at;
  const senderName = req.sender.login;
  const senderid = req.sender.id;

  await weebHookResult(reponame,repofullname,ssh_url,pushed_at,senderName,senderid)
  


  // Handle GitHub webhook event
  console.log(req.body);

  res.send('GitHub webhook received!');
});
app.use('/user', router);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
