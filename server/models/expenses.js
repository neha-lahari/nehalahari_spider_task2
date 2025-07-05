const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true
    },
    amount: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        paid: Number,
        owes: Number
    }],
    date: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Expenses', expenseSchema);
