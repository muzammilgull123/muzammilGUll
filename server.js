const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const { registerWebhook } = require('./webhook/registerwebhook');const pool = require('./dbconfig');
const router = require('./api/router');
const { storeGithHubTokeninfo, weebHookResult } = require('./api/controller');
const { getUserIdByToken, checkUserAlreadyLogen, getIdByUserID, gitAlert } = require('./api/services');
const { useNavigate } = require('react-router-dom');
const cors = require('cors');
const jsonStringify = require('./helpers/inputJson');
const { formatDataToJSON } = require('./helpers/jsondata');
const { sendSlackNotification } = require('./webhook/slacknotification');
dotenv.config();
app.use(express.json());
app.use(cors());
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

app.get('/login/github', (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}&scope=repo%20admin:org`;

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

      },
      headers: {
        accept: 'application/json',
      },
    });
    const oauthToken = response.data.access_token;
    console.log("oauthToken from login", oauthToken);
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${oauthToken}`,
      },

    });
    const userName = userResponse.data.login;
    const userid = userResponse.data.id;
    const checkUser = await checkUserAlreadyLogen(oauthToken);
    console.log("checkuser", checkUser)
    if (checkUser[0].token_count > 0) {

      res.send("webhook register already ");

    }
    else {
      storeGithHubTokeninfo(userName, userid, oauthToken);
      res.redirect(`http://localhost:3002/thankyou/${oauthToken}/${userName}/${userid}`);
    }



  } catch (error) {
    console.error('Error exchanging auth token for access token:', error);
    console.error('GitHub API Error:', error.response ? error.response.data : 'No response');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/webhookdetail', async (req, res) => {
  try {

    const { repoName, repoOwner, token } = req.body;

    const owner = repoOwner;
    const repo = repoName;
    console.log("token from register api", token)
    console.log("owner", "repo", owner, repo);
    
    const associateId =  getUserIdByToken(token);
    const {tokenId}=associateId
    const webhookUrl = 'https://cf61-39-51-71-99.ngrok-free.app/webhook/github';
    const result = await registerWebhook(owner, repo, webhookUrl, token,tokenId);
      
    res.status(200).json = {
      data: result,
    }
  } catch (error) {
    console.error('Error in webhookdetail endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  const repofullname = req.body.repository.full_name;
  const reponame = req.body.repository.name;
  const repoOwner = req.body.repository.owner.login;
  const ssh_url = req.body.repository.ssh_url;
  const senderName = req.body.sender.login;
  const senderId = req.body.sender.id;
  const user_id = req.body.repository.owner.id;


  const githubTokenId = await getIdByUserID(user_id);
  const jsonData = formatDataToJSON(repofullname, reponame, repoOwner, ssh_url, senderName, senderId, user_id);
   await sendSlackNotification(jsonData);
  console.log("getIdByUserID[0].id", githubTokenId)
  await weebHookResult(reponame, repofullname, ssh_url, senderName, senderId, githubTokenId[0].id, repoOwner);
  const value = await jsonStringify(payload);
  await gitAlert(githubTokenId[0].id, user_id, value)

  res.send('GitHub webhook received!');
});
app.use('/user', router);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));



