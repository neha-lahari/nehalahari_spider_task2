const express = require('express');
const router = express.Router();
const { search_user, send_request, accept_request, reject_request, unFriend, getFriendStatus } = require('../controllers/friendcontrollers');

const authenticate = require('../middleware/jwtmiddleware');
router.get('/search', authenticate, search_user);
router.post('/request/:id', authenticate, send_request);
router.post('/accept/:id', authenticate, accept_request);
router.post('/reject/:id', authenticate, reject_request);
router.post('/unfriend/:id', authenticate, unFriend);
router.get('/status', authenticate, getFriendStatus);


module.exports = router;