const repoinfo =(repoName,repoOwnerName)=>{
    if(repoName==null || repoOwnerName==null){
        return res.status(401).json({ message: 'repoName OR repoOwnerName is missing' });
    }
return repoName,repoOwnerName
}

module.exports={
    repoinfo
}