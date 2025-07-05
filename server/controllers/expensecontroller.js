const Expense = require('../models/expenses');
const Group = require('../models/groups');
const User = require('../models/user');
const Activity = require('../models/activity');
// Add an expense
exports.addExpense = async (req, res) => {
    const { groupId, amount, category, paidBy } = req.body;
    try {
        const group = await Group.findById(groupId).populate('members');
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        const members = group.members;
        const share = amount / members.length;

        const participants = members.map(member => ({//creates an array
            user: member._id,
            paid: member._id.toString() === paidBy ? amount : 0,
            owes: share
        }));
        const newExpense = new Expense({
            group: groupId, amount, category,
            addedBy: req.user.userId,
            participants
        });

        await newExpense.save();

        await Activity.create({
            user: req.user.userId,
            group: group._id,
            groupName: group.name,
            type: "expense_added",
            amount
        });

        res.status(201).json(newExpense);
    } catch (err) {
        console.error("Add expense error:", err);
        res.status(500).json({ error: err.message });
    }
};
// Delete an expense
exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;

    try {
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        if (expense.addedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Only the creator can delete this expense' });
        }

        const group = await Group.findById(expense.group);
        await expense.deleteOne();

        await Activity.create({//inserts a new document into that collection.
            user: req.user.userId,
            group: expense.group,
            groupName: group?.name || "Unknown Group",
            type: "expense_deleted",
            amount: expense.amount
        });

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.error("Delete expense error:", err);
        res.status(500).json({ error: err.message });
    }
};
// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;
    try {
        //in  sorted order from newest to oldest by date.
        const expenses = await Expense.find({ group: groupId }).sort({ date: -1 });
        res.json({ expenses });
    } catch (err) {
        res.status(500).json({ error: "Failed to get expenses" });
    }
};
