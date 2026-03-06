const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/jwtmiddleware');

const {
    search_user,
    send_request,
    accept_request,
    reject_request,
    unFriend,
    getFriendStatus,
    cancel_request
} = require('../controllers/friendcontrollers');

router.get('/search', authenticate, search_user);
router.post('/request/:id', authenticate, send_request);
router.post('/accept/:id', authenticate, accept_request);
router.post('/reject/:id', authenticate, reject_request);
router.post('/unfriend/:id', authenticate, unFriend);
router.post('/cancel/:id', authenticate, cancel_request);
router.get('/status', authenticate, getFriendStatus);

module.exports = router;