const express = require("express");
const router = express.Router();
const { createGroup, removeMem, deleteGroup, MyGroups, getGroupById } = require('../controllers/groupcontrollers');
const authenticate = require("../middleware/jwtmiddleware");

router.post("/", authenticate, createGroup);
router.patch("/:id/removeMember", authenticate, removeMem);
router.delete("/:id", authenticate, deleteGroup);
router.get("/my", authenticate, MyGroups);
router.get("/:id", authenticate, getGroupById);
module.exports = router;