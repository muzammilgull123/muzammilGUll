const { storeData, storeUserInfo, storeWebhookresult } = require("./services");


const getRepoInfo = async (req, res) => {
    const { name, slackChannel, repoOwnerName, repoName } = req.body;

    // Check if any required field is missing
    if (name == null || slackChannel == null || repoOwnerName == null || repoName == null) {
        return res.status(401).json({ message: 'Some fields are missing' });
    }

    try {
        // Call the storeData function from your service file
        const result = await storeData(name, slackChannel, repoOwnerName, repoName);
        RepoInfo(repoOwnerName,repoName);
        
        res.json(result); // Send response with the result
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const storeGithHubTokeninfo =async(userName,userid,oauthToken)=>{
    await storeUserInfo(userName,userid,oauthToken);

} 
const weebHookResult = async (reponame,repofullname,ssh_url,pushed_at,senderName)=>{
    console.log("webhook",reponame,repofullname,ssh_url,pushed_at,senderName)
    await storeWebhookresult(reponame,repofullname,ssh_url,pushed_at,senderName)
}

module.exports = {
    getRepoInfo,
    storeGithHubTokeninfo,
    weebHookResult,

};