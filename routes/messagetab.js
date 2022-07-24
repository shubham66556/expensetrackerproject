const express = require('express');

const router = express.Router();

const authanticateMiddleware = require('../middleware/authenticate')
const messageTabController = require('../controllers/messageTab');

router.get('/join', authanticateMiddleware.authenticateUser,messageTabController.getUser)

router.post('/message', authanticateMiddleware.authenticateUser,messageTabController.postMessage)

router.get('/recieve', authanticateMiddleware.authenticateUser,messageTabController.getMessage)



module.exports = router;