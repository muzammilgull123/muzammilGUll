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
     getTokenByValue : (tokenValue) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM github_token WHERE token = ?`;
            pool.query(sql, [tokenValue], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getUserIdByToken : (tokenValue) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id as 'user_id' FROM github_token WHERE token = ?`;
            pool.query(sql, [tokenValue], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    // getRepoNameRepoWnername: (repoOwner,repoName,id) => {
        
    //     return new Promise((resolve, reject) => {
    //         const sql = `INSERT INTO github_token () VALUES (?, ?, ?)`;
    //         pool.query(sql, [repoName,repoOwner,id], (error, results) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(results);
    //             }
    //         });
    //     });
    // },
checkUserAlreadyLogen:(tokenValue) => {
    console.log(`SELECT COUNT(id) as 'token_count' FROM github_token WHERE token = `+tokenValue)
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(id) as 'token_count' FROM github_token WHERE token = ?`;
        pool.query(sql, [tokenValue], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
},

gitAlert: (repoOwner,repoName,id) => {
        
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO git_alerts () VALUES (?, ?, ?)`;
        pool.query(sql, [], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
},

};

