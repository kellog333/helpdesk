const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');

const TicketSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    },
    customernumber: {
        type: Number,
    },
    name: {
        type: String,
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'client'
    },
    contactname: {
        type: String
    },
    contactphone: {
        type: String,
    },
    contactemail: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    ticketnumber: {
        type: Number,
        required: true,
        unique: true,
    },
    assignedto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    assignedname: {
        type: String,
    },
    timeon: {
        type: Float,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    closedate: {
        type: Date,
    },
    description: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    archived: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    lastmodified: {
        type: Date,
        default: Date.now
    },
    notes: [
        {
            notetaker: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now
            },
            priv: {
                type: Boolean,
                default: false
            },
            time: {
                type: Number
            }
        }
    ]
});

TicketSchema.plugin(mongoosePaginate);

module.exports = Ticket = mongoose.model('ticket', TicketSchema);