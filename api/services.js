const pool = require("../dbconfig");

module.exports = {
    storeData: () => {
        return new Promise((resolve, reject) => {
            pool.query('', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    storeUserInfo :(userName, userId, oauthToken) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO github_token (username, user_id, token) VALUES (?, ?, ?)`;
            pool.query(sql, [userName, userId, oauthToken], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    storeWebhookresult :(repoName, repoFullname, sshUrl, pushedAt, senderName, senderId) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO github_webhook (repository_name, repository_fullname, ssh_url, pushed_at, sender_name, sender_id) VALUES (?, ?, ?, ?, ?, ?)`;
            pool.query(sql, [repoName, repoFullname, sshUrl, pushedAt, senderName, senderId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    
  
};

