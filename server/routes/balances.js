const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/jwtmiddleware");
const { Balances } = require('../controllers/balancecontrollers');

router.get("/:groupId/balances", authenticate, Balances);

module.exports = router;