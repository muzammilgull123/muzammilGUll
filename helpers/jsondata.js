function formatDataToJSON(repofullname, reponame, repoOwner, ssh_url, senderName, senderId, user_id) {
    const jsonData = {
        repository: {
            full_name: repofullname,
            name: reponame,
            owner: {
                login: repoOwner,
                id: user_id
            },
            ssh_url: ssh_url
        },
        sender: {
            login: senderName,
            id: senderId
        }
    };

    return jsonData;
}

module.exports = {formatDataToJSON};