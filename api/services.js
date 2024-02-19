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
    storeUserInfo: (userName, userId, oauthToken) => {
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
    storeWebhookresult: (reponame, repofullname, ssh_url, senderName, senderId, token_id, repoOwner) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO github_webhook (repository_name, repository_fullname, ssh_url,sender_name,sender_id,github_token_id,repo_owners) VALUES (?, ?, ?, ?, ?, ?,?)`;
            pool.query(sql, [reponame, repofullname, ssh_url, senderName, senderId, token_id, repoOwner], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getTokenByValue: (tokenValue) => {
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
    getUserIdByToken: (tokenValue) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id as 'tokenId' FROM github_token WHERE token = ?`;
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
    checkUserAlreadyLogen: (tokenValue) => {
        // console.log(`SELECT COUNT(id) as 'token_count' FROM github_token WHERE token = `+tokenValue)
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

    gitAlert: (id, user_id, value) => {

        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO git_alerts (github_id,user_id,value) VALUES (?, ?, ?)`;
            pool.query(sql, [id, user_id, value], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    storeRegisterWebhook: async (webhookType, webhookId, webhookName, webhookActive, webhookCreatedAt, webhookEvents, webhookUpdatedAt, webhookTestUrl, webhookPingUrl, webhookDeliveriesUrl, webhookLastResponseStatus,tokenId) => {
        try {
            const sql = `INSERT INTO webhook_registration 
                     (associated_token_id, webhook_type, webhook_id, webhook_name, 
                      webhook_active, webhook_events, webhook_created_at, 
                      webhook_updated_at, webhook_test_url, webhook_ping_url, 
                      webhook_deliveries_url, webhook_last_response_status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                tokenId,
                webhookType,
                webhookId,
                webhookName,
                webhookActive,
                webhookEvents.join(','),
                webhookCreatedAt,
                webhookUpdatedAt,
                webhookTestUrl,
                webhookPingUrl,
                webhookDeliveriesUrl,
                webhookLastResponseStatus
            ];

            const results = await pool.query(sql, values);
            return results;
        } catch (error) {
            throw error;
        }
    },
    getIdByUserID: (user_id) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM github_token WHERE user_id = ?`;
            pool.query(sql, [user_id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },                    
    registerWebhookresult: (repoName, repoOwner, token, userId, userName, chanelId, tokenId) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO registerwebhook (repoName, repoOwner, token, userId, userName, chanelId, tokenid) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            pool.query(sql, [repoName, repoOwner, token, userId, userName, chanelId, tokenId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        
    },
    
    getChanelIdByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT chanelId FROM registerwebhook WHERE userId = ?`;
            pool.query(sql, [userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    


};

