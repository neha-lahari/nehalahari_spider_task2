const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/jwtmiddleware");

const { getActivities, deleteActivity } = require("../controllers/activityController");

router.get("/", authenticate, getActivities);
router.delete("/:id", authenticate, deleteActivity);

module.exports = router;
