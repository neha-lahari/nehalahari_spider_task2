const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/jwtmiddleware");

const { addExpense, deleteExpense, getGroupExpenses } = require('../controllers/expensecontroller');
router.post('/add', authenticate, addExpense);
router.delete('/:id', authenticate, deleteExpense);
router.get('/group/:groupId', authenticate, getGroupExpenses);

module.exports = router;