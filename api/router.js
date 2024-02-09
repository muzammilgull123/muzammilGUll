const express = require('express');
const { getRepoInfo } = require('./controller');
const router = express.Router();

router.post('/users',getRepoInfo);



module.exports = router;