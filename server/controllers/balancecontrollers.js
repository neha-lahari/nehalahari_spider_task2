const User = require("../models/user");
const Group = require("../models/groups");
const Expense = require("../models/expenses");

exports.Balances = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId).populate("members", "username");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        const expenses = await Expense.find({ group: groupId });
        const categoryExpenses = {};
        const balances = [];

        for (let ex of expenses) {
            if (!ex.participants || !Array.isArray(ex.participants)) continue;

            if (!categoryExpenses[ex.category]) {
                categoryExpenses[ex.category] = 0;
            }
            categoryExpenses[ex.category] += ex.amount;

            const total = ex.amount;
            const members = ex.participants;
            for (let payer of members) {
                if (payer.paid === 0) continue;

                for (let others of members) {
                    if (payer.user.toString() === others.user.toString()) continue;

                    const share = (payer.paid / members.length);
                    balances.push({
                        from: others.user.toString(),
                        to: payer.user.toString(),
                        amount: Number(share.toFixed(2)),
                    });
                }
            }
        }

        const usernames = {};//Creates a mapping from user ID to username.
        for (let member of group.members) {
            usernames[member._id.toString()] = member.username;
        }
        const realbalances = balances.map(b => ({
            from: usernames[b.from],//to replace with actual names
            to: usernames[b.to],
            amount: b.amount,
        }));
        const memberNames = group.members.map(m => m.username);
        res.json({
            members: memberNames,
            balances: realbalances,
            categoryExpenses,
        });

    } catch (err) {
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
};
