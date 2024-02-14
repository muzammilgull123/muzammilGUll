const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const { registerWebhook } = require('./webhook/registerwebhook');
// const { getPersnalAccessToken } = require('./webhook/persnalAccessToken');
// const {createPersonalAccessToken} = require('./webhook/persnalAccessToken');
const pool = require('./dbconfig');
const router = require('./api/router');
const { storeGithHubTokeninfo, weebHookResult } = require('./api/controller');
const { getUserIdByToken, checkUserAlreadyLogen, getIdByUserID, gitAlert} = require('./api/services');
const { useNavigate } = require('react-router-dom');
const cors = require('cors');
const jsonStringify = require('./helpers/inputJson');


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

app.get('/login/github',(req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}&scope=repo%20admin:org`;

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
        
      },
      headers: {
        accept: 'application/json',
      },
    });
  //   const repoInfo= await getRepodETail()
   
  //   const webhookUrl = 'https://a445-39-51-66-18.ngrok-free.app/webhook/github';
    

  //  const owner = repoInfo.repoOwner;
  //   const reponame=repoInfo.repoName;
   
    
    const oauthToken = response.data.access_token;
      console.log("oauthToken from login",oauthToken);
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${oauthToken}`,
        },
        
      });
     const userName= userResponse.data.login;
     const userid = userResponse.data.id;
   
  

    
      
      const checkUser = await checkUserAlreadyLogen(oauthToken);
      console.log("checkuser",checkUser)
    if(checkUser[0].token_count>0){
      
      res.send("webhook register already ");
    
      }
    else{
      storeGithHubTokeninfo(userName,userid,oauthToken);
      res.redirect(`http://localhost:3001/thankyou/${oauthToken}/${userName}/${userid}`);

    //  console.log("owner,repo",repo,owner)
    //   res.json({
    //     data :repo,owner
    //   })
    //   await gitAlert(user_id[0].user_id);
    //   console.log("auth",oauthToken);
    //   await registerWebhook(owner, repo, webhookUrl, oauthToken);
      }

      
    
 } catch (error) {
    console.error('Error exchanging auth token for access token:', error);
    console.error('GitHub API Error:', error.response ? error.response.data : 'No response');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/webhookdetail', async(req,res)=>{
  try {
    
    const {repoName, repoOwner,token }= req.body;
    
      const owner = repoOwner;
      const repo = repoName;
      console.log("token from register api",token)
      console.log("owner", "repo", owner, repo);
     
      const webhookUrl ='https://9749-39-51-66-164.ngrok-free.app/webhook/github';
      // const result = await registerWebhook(owner, repo, webhookUrl,token);
      // const userDetail = await getUserIdByToken(token);
      // console.log("useerDetail",userDetail);
      // const {id,user_id}=userDetail[0]
      // await gitAlert(id,user_id)
      res.status(200).json={
      data:result,
      }
  } catch (error) {
      console.error('Error in webhookdetail endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  // console.log("starting of request.ody",req.body);
 
  
  // console.log("ending of request.ody");
  // const reponame = jsonObject.repository.name;
  const repofullname = req.body.repository.full_name;
  const reponame = req.body.repository.name;
  const repoOwner = req.body.repository.owner.login;
const ssh_url = req.body.repository.ssh_url;
const pushed_at = req.body.head_commit.timestamp;
const senderName = req.body.sender.login;
const senderId = req.body.sender.id;
const user_id = req.body.repository.owner.id;


const githubTokenId = await getIdByUserID(user_id);

console.log("getIdByUserID[0].id",githubTokenId [0].id)
  
await weebHookResult(reponame,repofullname,ssh_url,pushed_at,senderName,senderId,githubTokenId[0].id,repoOwner);
  
  const value = await jsonStringify(payload);
   
  // console.log("inputJsonResult ",value);
  await gitAlert(githubTokenId[0].id,user_id,value)
 

    
  

  

  


  // Handle GitHub webhook event
  // console.log(req.body);

  res.send('GitHub webhook received!');
});
app.use('/user',router);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
   


