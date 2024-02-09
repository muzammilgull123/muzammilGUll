const { Octokit } = require("@octokit/rest");
const axios = require("axios"); // Import Axios

// Function to create a personal access token
async function createPersonalAccessToken(oauthAppToken) {
    const octokit = new Octokit({ 
        auth: oauthAppToken,
        request: {
            fetch: axios // Use Axios for making requests
        }
    });

    try {
        const response = await octokit.request('POST /login/oauth/access_token', {
            client_id: process.env.GITHUB_APP_CLIENT_ID,
            client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
            // code: code,
            scope: 'repo admin:org', // Specify the required scopes
        });
        const personalAccessToken = response.data.access_token; // Get the generated personal access token
        console.log("Personal Access Token created successfully:", personalAccessToken);
        return personalAccessToken; // Return the token
    } catch (error) {
        console.error("Error creating Personal Access Token:", error.message);
        throw error; // Throw the error to be handled by the caller
    }
}

// Export the function
module.exports = {createPersonalAccessToken};
