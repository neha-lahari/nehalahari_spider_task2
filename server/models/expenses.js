const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    paid: {
        type: Number,
        default: 0,
        min: 0
    },

    owes: {
        type: Number,
        default: 0,
        min: 0
    }

}, { _id: false });


const expenseSchema = new mongoose.Schema({

    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    participants: {
        type: [participantSchema],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one participant is required"
        }
    },

    splitType: {
        type: String,
        enum: ['equal', 'exact', 'percentage'],
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
