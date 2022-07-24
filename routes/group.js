const express = require('express');

const router = express.Router();

const authanticateMiddleware = require('../middleware/authenticate')
const groupController = require('../controllers/group');

router.post('/creategroup', authanticateMiddleware.authenticateUser,groupController.createGroup);

router.post('/addmember', authanticateMiddleware.authenticateUser,groupController.addMember);

router.get('/name', authanticateMiddleware.authenticateUser,groupController.userGroup);

router.get('/getchat', authanticateMiddleware.authenticateUser,groupController.getGroupChat);

router.post('/sendchat', authanticateMiddleware.authenticateUser,groupController.postToGroup);




module.exports = router;